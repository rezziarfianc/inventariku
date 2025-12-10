<?php

namespace App\Http\Controllers\Api\V1;

use App\Helpers\ApiHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\GetBrandRequest;
use App\Http\Requests\Api\V1\StoreBrandRequest;
use App\Http\Requests\Api\V1\UpdateBrandRequest;
use App\Http\Resources\Api\V1\BrandResource;
use App\Models\Brand;
use Gate;
use Illuminate\Http\Request;

class BrandController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(GetBrandRequest $request)
    {
        try {
            $brands = Brand::query();

            $validated = $request->validated();
            $perPage = $validated['per_page'] ?? 10;
            if (isset($validated['sort_by']) && isset($validated['sort_order'])) {
                $brands->orderBy($validated['sort_by'], $validated['sort_order']);
            } else {
                $brands->orderBy('created_at', 'desc');
            }

            if (isset($validated['name'])) {
                $brands->where('name', 'like', '%' . $validated['name'] . '%');
            }

            $paginatedBrands = $brands->paginate($perPage);
            $paginatedBrands = BrandResource::collection($paginatedBrands);
            return ApiHelper::success($paginatedBrands, 'Brands retrieved successfully');
        } catch (\Exception $e) {
            \Log::error($e);
            return ApiHelper::error('An error occurred while fetching.', 500);
        }
    }

    public function auditHistory(Brand $brand)
    {
        try {
            if (Gate::denies('brands.view')) {
                return ApiHelper::error('Unauthorized', 403);
            }

            $audits = $brand->audits()->with('user')->get();

            return ApiHelper::success($audits, 'Brand audit history retrieved successfully');
        } catch (\Exception $e) {
            \Log::error($e);
            return ApiHelper::error('An error occurred while fetching audit history.', 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBrandRequest $request)
    {
        try {
            $validated = $request->validated();
            $brand = Brand::create($validated);
            return ApiHelper::success(new BrandResource($brand), 'Brand created successfully', 201);
        } catch (\Exception $e) {
            \Log::error($e);
            return ApiHelper::error('An error occurred while creating.', 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Brand $brand)
    {
        try {
            if (Gate::denies('brands.view')) {
                return ApiHelper::error('Unauthorized', 403);
            }

            return BrandResource::resource($brand);
        } catch (\Exception $e) {
            \Log::error($e);
            return ApiHelper::error('An error occurred while fetching.', 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBrandRequest $request, Brand $brand)
    {
        try {
            $validated = $request->validated();

            $validated['name'] = !empty($validated['name']) ? $validated['name'] : $brand?->name;
            $validated['description'] = !empty($validated['description']) ? $validated['description'] : $brand?->description;

            $brand->update($validated);
            return ApiHelper::success(new BrandResource($brand), 'Brand updated successfully');
        } catch (\Exception $e) {
            \Log::error($e);
            return ApiHelper::error('An error occurred while updating.', 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Brand $brand)
    {
        try {
            if (Gate::denies('brands.delete')) {
                return ApiHelper::error('Unauthorized', 403);
            }

            $brand->delete();
            return ApiHelper::success(null, 'Brand deleted successfully');
        } catch (\Exception $e) {
            \Log::error($e);
            return ApiHelper::error('An error occurred while deleting.', 500);
        }
    }
}
