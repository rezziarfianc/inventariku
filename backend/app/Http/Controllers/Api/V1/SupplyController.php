<?php

namespace App\Http\Controllers\Api\V1;

use App\Helpers\ApiHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\GetSupplyRequest;
use App\Http\Requests\Api\V1\StoreSupplyRequest;
use App\Http\Resources\Api\V1\SupplyFlowResource;
use App\Models\Product;
use App\Models\Supply;
use App\Models\SupplyFlow;
use DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class SupplyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(GetSupplyRequest $request)
    {
        try {
            $supplyFlows = SupplyFlow::query();

            $validated = $request->validated();
            $perPage = $validated['per_page'] ?? 10;
            if (isset($validated['sort_by']) && isset($validated['sort_order'])) {
                $supplyFlows->orderBy($validated['sort_by'], $validated['sort_order']);
            } else {
                $supplyFlows->orderBy('created_at', 'desc');
            }
            if (isset($validated['flow_type'])) {
                $supplyFlows->where('flow_type', $validated['flow_type']);
            }
            if (isset($validated['product_id'])) {
                $supplyFlows->where('product_id', $validated['product_id']);
            }
            if (isset($validated['product_name'])) {
                $productIds = Product::where('name', 'like', '%' . $validated['product_name'] . '%')->pluck('product_id');
                $supplyFlows->whereIn('product_id', $productIds);
            }
            if (isset($validated['brand_id'])) {
                $productIds = Product::where('brand_id', $validated['brand_id'])->pluck('product_id');
                $supplyFlows->whereIn('product_id', $productIds);
            }

            if (isset($validated['stock_status'])) {
                switch ($validated['stock_status']) {
                    case 'in_stock':
                        $supplyFlows = $supplyFlows->whereHas('supply', function ($query) {
                            $query->where('quantity', '>', 0);
                        });
                        break;
                    case 'out_of_stock':
                        $supplyFlows = $supplyFlows->whereHas('supply', function ($query) {
                            $query->where('quantity', '=', 0);
                        });
                        break;
                    case 'low_stock':
                        $supplyFlows = $supplyFlows->whereHas('supply', function ($query) {
                            $query->where('quantity', '<=', 5);
                        });
                        break;
                }
            }

            $supplyFlows = $supplyFlows->with(['product']);
            
            $paginatedSupplyFlows = $supplyFlows->paginate($perPage);
            $paginatedSupplyFlows = SupplyFlowResource::collection($paginatedSupplyFlows);
            return ApiHelper::success($paginatedSupplyFlows, 'Supply flows retrieved successfully');
        } catch (\Exception $e) {
            \Log::error($e);
            return ApiHelper::error('An error occurred while fetching.', 500);
        }
    }

    public function show(string $supplyFlow)
    {
        try {
            $supplyFlow = SupplyFlow::findOrFail($supplyFlow)->first();
            $supplyFlow->load(['product', 'supply']);
            
            $supplyFlowResource = new SupplyFlowResource($supplyFlow);
            return ApiHelper::success($supplyFlowResource, 'Supply flow retrieved successfully');
        } catch (\Exception $e) {
            \Log::error($e);
            return ApiHelper::error('An error occurred while fetching.', 500);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(StoreSupplyRequest $request)
    {
        try {
            $validated = $request->validated();
            
            $product = Product::findOrFail($request['product_id']);
            $supply = Supply::where('product_id', $product->product_id)->firstOrFail();

            DB::beginTransaction();
            $currentQty = $supply->quantity;
            $quantity = $validated['quantity'] ?? null;
            $flowType = $validated['flow_type'] ?? null;

            if ($flowType === 'inbound') {
                $supply->quantity = $currentQty + $quantity;
            } elseif ($flowType === 'outbound') {
                if ($currentQty < $quantity) {
                    return ApiHelper::error('Insufficient stock for outbound flow.', 400);
                }
                $supply->quantity = $currentQty - $quantity;
            }

            $supply->save();
            
            $supplyFlow = SupplyFlow::create([
                'supply_id' => $supply->supply_id,
                'flow_type' => $flowType,
                'product_id' => $supply->product_id,
                'quantity' => abs($quantity),
            ]);

            DB::commit();
            $supplyFlow->load(['product', 'supply']);

            if ($supply->quantity <= $product->low_stock_threshold && $flowType === 'outbound') {
                $whatsappService = app(\App\Services\WhatsappService::class);
                $whatsappService->sendNotification($supplyFlow);
            }

            $supplyFlow = new SupplyFlowResource($supplyFlow);
            return ApiHelper::success($supplyFlow, 'Supply flow created successfully', 201);

        } catch (ModelNotFoundException $e) {
            return ApiHelper::error('Product not found.', 404);
        }
        catch (\Exception $e) {
            \Log::error($e);
            return ApiHelper::error('An error occurred while creating flow.', 500);
        }
    }


}
