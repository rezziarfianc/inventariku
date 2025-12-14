<?php

namespace App\Http\Controllers\Api\V1;

use App\Helpers\ApiHelper;
use App\Http\Controllers\Controller;
use App\Models\SupplyFlow;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    public function dashboard(Request $request)
    {
        try {
            $startDateInput = $request->input('start_date');
            $endDateInput = $request->input('end_date');

            // Default to last 30 days if not provided
            if (!$startDateInput) {
                $startDate = Carbon::now()->subDays(30)->startOfDay();
            } else {
                $startDate = Carbon::parse($startDateInput);
                // If the input string didn't have time (length check is a simple heuristic, or check format), 
                // but usually user sends Y-m-d H:i:s. If they send Y-m-d we might want startOfDay.
                // For simplicity, let Carbon parse. If user sends strict date, Carbon defaults time to 00:00:00.
                // We rely on client sending H:i:s if they want precision.
            }

            if (!$endDateInput) {
                $endDate = Carbon::now()->endOfDay();
            } else {
                $endDate = Carbon::parse($endDateInput);
            }

            // Summary Totals
            $summary = [
                'total_inbound' => SupplyFlow::where('flow_type', 'inbound')
                    ->whereBetween('created_at', [$startDate, $endDate])
                    ->sum('quantity'),
                'total_outbound' => SupplyFlow::where('flow_type', 'outbound')
                    ->whereBetween('created_at', [$startDate, $endDate])
                    ->sum('quantity'),
                'total_transactions' => SupplyFlow::whereBetween('created_at', [$startDate, $endDate])->count(),
            ];

            // Trends (Daily)
            $trends = SupplyFlow::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw("SUM(CASE WHEN flow_type = 'inbound' THEN quantity ELSE 0 END) as inbound"),
                DB::raw("SUM(CASE WHEN flow_type = 'outbound' THEN quantity ELSE 0 END) as outbound")
            )
                ->whereBetween('created_at', [$startDate, $endDate])
                ->groupBy('date')
                ->orderBy('date', 'asc')
                ->get();

            // Top Products (by total movement quantity)
            $topProducts = SupplyFlow::select(
                'products.name as product_name',
                DB::raw('SUM(supply_flows.quantity) as total_moved')
            )
                ->join('products', 'supply_flows.product_id', '=', 'products.product_id')
                ->whereBetween('supply_flows.created_at', [$startDate, $endDate])
                ->groupBy('products.product_id', 'products.name')
                ->orderByDesc('total_moved')
                ->limit(5)
                ->get();

            $data = [
                'summary' => $summary,
                'trends' => $trends,
                'top_products' => $topProducts,
                'period' => [
                    'start' => $startDate->toDateString(),
                    'end' => $endDate->toDateString()
                ]
            ];

            return ApiHelper::success($data, 'Analytics data retrieved successfully');
        } catch (\Exception $e) {
            \Log::error($e);
            return ApiHelper::error('An error occurred while fetching analytics.', 500);
        }
    }
}
