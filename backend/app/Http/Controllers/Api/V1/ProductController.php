<?php

namespace App\Http\Controllers\Api\V1;

use App\Helpers\ApiHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\GetProductRequest;
use App\Http\Requests\Api\V1\StoreProductRequest;
use App\Http\Requests\Api\V1\UpdateProductRequest;
use App\Http\Resources\Api\V1\AuditResource;
use App\Http\Resources\Api\V1\ProductResource;
use App\Models\Product;
use App\Models\SupplyFlow;
use DB;
use Gate;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(GetProductRequest $request)
    {
        try {
            $products = Product::query();
            $validated = $request->validated();

            $perPage = $validated['per_page'] ?? 10;
            if (isset($validated['sort_by']) && isset($validated['sort_order'])) {
                $products->orderBy($validated['sort_by'], $validated['sort_order']);
            }
            if (isset($validated['name'])) {
                $products->where('name', 'like', '%' . $validated['name'] . '%');
            }
            if (isset($validated['category_id'])) {
                $products->where('category_id', $validated['category_id']);
            }
            if (isset($validated['min_price'])) {
                $products->where('price', '>=', $validated['min_price']);
            }
            if (isset($validated['max_price'])) {
                $products->where('price', '<=', $validated['max_price']);
            }
            if (isset($validated['stock_status'])) {
                $products->select('products.*');
                $products->leftJoin('supplies', 'products.product_id', '=', 'supplies.product_id');
                switch ($validated['stock_status']) {
                    case 'in_stock':
                        $products->whereColumn('supplies.quantity', '>', 'products.low_stock_threshold');
                        break;
                    case 'out_of_stock':
                        $products->where(function ($query) {
                            $query->whereNull('supplies.quantity')
                                ->orWhere('supplies.quantity', '=', 0);
                        });
                        break;
                    case 'low_stock':
                        $products->whereColumn('supplies.quantity', '<=', 'products.low_stock_threshold');
                        break;
                }
            } else {
                $products->with('supply');
            }
            $paginatedProducts = $products->paginate($perPage);
            $paginatedProducts = ProductResource::collection($paginatedProducts);

            return ApiHelper::success($paginatedProducts, 'Products retrieved successfully');
        } catch (\Exception $e) {
            \Log::error($e);
            return ApiHelper::error('An error occurred while fetching products.', 500);
        }
    }

    public function auditHistory(Product $product, GetProductRequest $request)
    {
        if (Gate::denies('products.view')) {
            return ApiHelper::error('You dont have access to this resource', 403);
        }
        $validated = $request->validated();
        $audits = $product->audits();

        if (isset($validated['sort_by']) && isset($validated['sort_order'])) {
            $audits->orderBy($validated['sort_by'], $validated['sort_order']);
        } else {
            $audits->latest();
        }

        $audits = $audits->paginate($validated['per_page'] ?? 10);
        $audits = AuditResource::collection($audits);
        return ApiHelper::success($audits, 'Product audit history retrieved successfully');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        try {
            $validated = $request->validated();
            $quantity = $validated['quantity'] ?? 0;
            unset($validated['quantity']);
            $product = Product::create($validated);

            $product->supply()->create([
                'quantity' => $quantity,
            ]);

            $product->load(['supply', 'category']);

            if ($quantity > 0) {
                SupplyFlow::create([
                    'supply_id' => $product->supply->supply_id,
                    'flow_type' => 'inbound',
                    'product_id' => $product->product_id,
                    'quantity' => $quantity,
                ]);
            }

            return ApiHelper::success(new ProductResource($product), 'Product created successfully', 201);
        } catch (\Exception $e) {
            \Log::error($e);
            return ApiHelper::error('An error occurred while creating the product.', 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        try {
            if (Gate::denies('products.view')) {
                return ApiHelper::error('You dont have access to this resource', 403);
            }
            return ApiHelper::success(new ProductResource($product->load(['category', 'supply'])), 'Product retrieved successfully');
        } catch (\Exception $e) {
            \Log::error($e);
            return ApiHelper::error('An error occurred while fetching the product.', 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        try {
            $validated = $request->validated();

            if (empty($validated)) {
                return ApiHelper::success(new ProductResource($product->load(['supply', 'category'])), 'No changes made to the product');
            }

            $quantity = $validated['quantity'] ?? null;
            unset($validated['quantity']);

            DB::beginTransaction();

            $product->update($validated);
            $currentQty = $product->supply->quantity;
            
            $product->load(['supply', 'category']);

            if ($quantity !== null) {
                $quantity = (int) $quantity;
                
                $qtyDiff = $quantity - $currentQty;
                $flowType = ($quantity > $currentQty) ? 'inbound' : 'outbound';

                $product->supply()->update([
                    'quantity' => $quantity,
                ]);

                SupplyFlow::create([
                    'supply_id' => $product->supply->supply_id,
                    'flow_type' => $flowType,
                    'product_id' => $product->product_id,
                    'quantity' => abs($qtyDiff),
                ]);

            }

            DB::commit();

            $product->refresh();
            return ApiHelper::success(new ProductResource($product), 'Product updated successfully');
        } catch (\Exception $e) {
            \Log::error($e);
            return ApiHelper::error('An error occurred while updating the product.', 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        try {
            if (Gate::denies('products.delete')) {
                return ApiHelper::error('You dont have access to this resource', 403);
            }
            $product->delete();
            return ApiHelper::success(null, 'Product deleted successfully');
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred while deleting the product.', 500);
        }
    }
}
