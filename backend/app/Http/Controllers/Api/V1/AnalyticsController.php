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
            $productId = $request->input('product_id');

            // Default to last 30 days if not provided
            if (!$startDateInput) {
                $startDate = Carbon::now()->subDays(30)->startOfMonth()->startOfDay();
            } else {
                $startDate = Carbon::parse($startDateInput);
            }
            if (!$endDateInput) {
                $endDate = Carbon::now()->endOfDay();
            } else {
                $endDate = Carbon::parse($endDateInput);
            }


            // Calculate number of days in period
            $numberOfDays = $startDate->diffInDays($endDate);

            // Summary Totals
            $totalInbound = SupplyFlow::where('flow_type', 'inbound')
                ->whereBetween('created_at', [$startDate, $endDate]);

            $totalOutbound = SupplyFlow::where('flow_type', 'outbound')
                ->whereBetween('created_at', [$startDate, $endDate]);

            $totalTransactions = SupplyFlow::whereBetween('created_at', [$startDate, $endDate]);

            if ($productId) {
                $totalInbound->where('product_id', $productId);
                $totalOutbound->where('product_id', $productId);
                $totalTransactions->where('product_id', $productId);
            }

            $totalInbound = $totalInbound->sum('quantity');
            $totalOutbound = $totalOutbound->sum('quantity');
            $totalTransactions = $totalTransactions->count();

            $summary = [
                'total_inbound' => $totalInbound,
                'total_outbound' => $totalOutbound,
                'total_transactions' => $totalTransactions,
                'avg_inbound_per_day' => $numberOfDays > 0 ? round($totalInbound / $numberOfDays, 2) : 0,
                'avg_outbound_per_day' => $numberOfDays > 0 ? round($totalOutbound / $numberOfDays, 2) : 0,
                'avg_transactions_per_day' => $numberOfDays > 0 ? round($totalTransactions / $numberOfDays, 2) : 0,
            ];

            // Trends (Daily)
            $trendsData = SupplyFlow::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw("SUM(CASE WHEN flow_type = 'inbound' THEN quantity ELSE 0 END) as inbound"),
                DB::raw("SUM(CASE WHEN flow_type = 'outbound' THEN quantity ELSE 0 END) as outbound"),
                DB::raw("COUNT(*) as transactions")
            )
                ->whereBetween('created_at', [$startDate, $endDate])
                ->groupBy('date')
                ->orderBy('date', 'asc');

            if ($productId) {
                $trendsData->where('product_id', $productId);
            }

            $trendsData = $trendsData->get()->keyBy('date');

            // Fill in missing dates
            $trends = [];
            $currentDate = $startDate->copy();
            while ($currentDate->lte($endDate)) {
                $dateString = $currentDate->toDateString();
                if (isset($trendsData[$dateString])) {
                    $trends[] = $trendsData[$dateString];
                } else {
                    $trends[] = (object) [
                        'date' => $dateString,
                        'inbound' => 0,
                        'outbound' => 0,
                        'transactions' => 0
                    ];
                }
                $currentDate->addDay();
            }

            // Top Products (by total movement quantity)
            $topProducts = SupplyFlow::select(
                'products.name as product_name',
                DB::raw('SUM(supply_flows.quantity) as total_moved'),
                DB::raw("SUM(CASE WHEN flow_type = 'outbound' THEN quantity ELSE 0 END) as total_moved_outbound"),
                DB::raw("SUM(CASE WHEN flow_type = 'inbound' THEN quantity ELSE 0 END) as total_moved_inbound"),
                DB::raw("ROUND(AVG(CASE WHEN flow_type = 'outbound' THEN quantity END), 2) as avg_outbound"),
                DB::raw("ROUND(AVG(CASE WHEN flow_type = 'inbound' THEN quantity END), 2) as avg_inbound"),
                DB::raw("COUNT(*) as transaction_count")
            )
                ->join('products', 'supply_flows.product_id', '=', 'products.product_id')
                ->whereBetween('supply_flows.created_at', [$startDate, $endDate])
                ->groupBy('products.product_id', 'products.name')
                ->orderByDesc('total_moved');

            if ($productId) {
                $topProducts->where('products.product_id', $productId);
            }

            $topProducts = $topProducts->get();

            $data = [
                'summary' => $summary,
                'trends' => $trends,
                'top_products' => $topProducts,
                'period' => [
                    'start' => $startDate->toDateString(),
                    'end' => $endDate->toDateString(),
                    'days' => $numberOfDays
                ]
            ];

            return ApiHelper::success($data, 'Analytics data retrieved successfully');
        } catch (\Exception $e) {
            \Log::error($e);
            return ApiHelper::error('An error occurred while fetching analytics.', 500);
        }
    }

}
