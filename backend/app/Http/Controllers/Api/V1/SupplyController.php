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
use Illuminate\Http\Request;

class SupplyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(GetSupplyRequest $request)
    {
        try {
            $SupplyFlows = SupplyFlow::query();

            $validated = $request->validated();
            $perPage = $validated['per_page'] ?? 10;
            if (isset($validated['sort_by']) && isset($validated['sort_order'])) {
                $SupplyFlows->orderBy($validated['sort_by'], $validated['sort_order']);
            }
            $paginatedSupplyFlows = $SupplyFlows->paginate($perPage);
            $paginatedSupplyFlows = SupplyFlowResource::collection($paginatedSupplyFlows);
            return ApiHelper::success($paginatedSupplyFlows, 'Supply flows retrieved successfully');
        } catch (\Exception $e) {
            \Log::error($e);
            return ApiHelper::error('An error occurred while fetching.', 500);
        }
    }

    public function show(SupplyFlow $supplyFlow)
    {
        try {
            return SupplyFlowResource::resource($supplyFlow);
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

            $supply = Supply::findOrFail($request['supply_id']);
            $currentQty = $supply->quantity;
            $quantity = $validated['quantity'] ?? null;
            unset($validated['quantity']);

            $quantity = (int) $quantity;

            $qtyDiff = $quantity - $currentQty;
            $flowType = ($quantity > $currentQty) ? 'inbound' : 'outbound';

            $supply->update([
                'quantity' => $quantity,
            ]);

            $supplyFlow = SupplyFlow::create([
                'supply_id' => $supply->supply_id,
                'flow_type' => $flowType,
                'product_id' => $supply->product_id,
                'quantity' => abs($qtyDiff),
            ]);

            $supplyFlow = new SupplyFlowResource($supplyFlow);
            return ApiHelper::success($supplyFlow, 'Supply flow created successfully', 201);

        } catch (\Exception $e) {
            \Log::error($e);
            return ApiHelper::error('An error occurred while creating flow.', 500);
        }
    }

}
