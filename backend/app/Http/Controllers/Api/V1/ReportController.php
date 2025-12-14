<?php

namespace App\Http\Controllers\Api\V1;

use App\Helpers\ApiHelper;
use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\ProductResource;
use App\Http\Resources\Api\V1\SupplyFlowResource;
use App\Models\Product;
use App\Models\SupplyFlow;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ReportController extends Controller
{
    /**
     * Stock Movement Report
     * Lists supply flows within a period with details.
     */
    public function stockMovement(Request $request)
    {
        try {
            $query = SupplyFlow::with(['product', 'audits.user']);

            // Filters
            if ($request->has('start_date')) {
                $query->where('created_at', '>=', Carbon::parse($request->input('start_date')));
            }
            if ($request->has('end_date')) {
                $query->where('created_at', '<=', Carbon::parse($request->input('end_date')));
            }

            if ($request->has('product_id')) {
                $query->where('product_id', $request->input('product_id'));
            }

            if ($request->has('flow_type')) {
                $query->where('flow_type', $request->input('flow_type'));
            }

            // Sorting
            $query->orderBy('created_at', $request->input('sort_order', 'desc'));

            // Pagination
            $perPage = $request->input('per_page', 20);
            $flows = $query->paginate($perPage);

            return ApiHelper::success(SupplyFlowResource::collection($flows), 'Stock movement report retrieved successfully');

        } catch (\Exception $e) {
            \Log::error($e);
            return ApiHelper::error('An error occurred while fetching stock movement report.', 500);
        }
    }

    /**
     * Stock Summary Report
     * Lists current stock status and valuation by product.
     */
    public function stockSummary(Request $request)
    {
        try {
            $query = Product::with(['category', 'brand', 'supply']);

            // Filters
            if ($request->has('category_id')) {
                $query->where('category_id', $request->input('category_id'));
            }
            if ($request->has('brand_id')) {
                $query->where('brand_id', $request->input('brand_id'));
            }
            if ($request->has('status')) {
                $status = $request->input('status');
                if ($status === 'in_stock') {
                    $query->whereHas('supply', function($q) { $q->where('quantity', '>', 0); });
                } elseif ($status === 'out_of_stock') {
                    $query->whereHas('supply', function($q) { $q->where('quantity', '=', 0); });
                } elseif ($status === 'low_stock') {
                     $query->whereColumn('l_supply.quantity', '<=', 'products.low_stock_threshold'); // Requires intricate join or scope
                }
            }
            
             if ($request->has('status')) {
                 $status = $request->input('status');
                 if ($status === 'low_stock') {
                     $query->whereHas('supply', function ($q) {
                         $q->whereRaw('quantity <= products.low_stock_threshold');
                     });
                 } elseif ($status === 'out_of_stock') {
                      $query->whereHas('supply', function ($q) {
                         $q->where('quantity', 0);
                     });
                 } elseif ($status === 'in_stock') {
                      $query->whereHas('supply', function ($q) {
                         $q->where('quantity', '>', 0);
                     });
                 }
             }


            $perPage = $request->input('per_page', 20);
            $products = $query->paginate($perPage);

             $products->getCollection()->transform(function ($product) {
                 $product->total_value = $product->price * ($product->supply->quantity ?? 0);
                 return $product;
             });

            return ApiHelper::success($products, 'Stock summary report retrieved successfully'); // returning raw paginator works or resource

        } catch (\Exception $e) {
            \Log::error($e);
            return ApiHelper::error('An error occurred while fetching stock summary report.', 500);
        }
    }
}
