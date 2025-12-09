<?php

namespace App\Http\Controllers\Api\V1;

use App\Helpers\ApiHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\GetCategoryRequest;
use App\Http\Requests\Api\V1\StoreCategoryRequest;
use App\Http\Requests\Api\V1\UpdateCategoryRequest;
use App\Http\Resources\Api\V1\AuditResource;
use App\Http\Resources\Api\V1\CategoryResource;
use App\Models\Category;
use Gate;
use \Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     * 
     * @param GetCategoryRequest $request
     */
    public function index(GetCategoryRequest $request): JsonResponse
    {
        try {
            $categories = Category::query();

            $validated = $request->validated();
            $perPage = $validated['per_page'] ?? 10;
            if (isset($validated['sort_by']) && isset($validated['sort_order'])) {
                $categories->orderBy($validated['sort_by'], $validated['sort_order']);
            }

            $paginatedCategories = $categories->paginate($perPage);
            $categories = CategoryResource::collection($paginatedCategories);
            return ApiHelper::success($categories, 'Categories retrieved successfully');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while fetching categories.',
            ], 500);
        }
    }

    public function auditHistory(Category $category, GetCategoryRequest $request): JsonResponse
    {
        if (Gate::denies('categories.view')) {
            return ApiHelper::error('You dont have access to this resource', 403);
        }
        $validated = $request->validated();
        $audits = $category->audits();

        if( isset($validated['sort_by']) && isset($validated['sort_order'])) {
            $audits->orderBy($validated['sort_by'], $validated['sort_order']);
        } else {
            $audits->latest();
        }

        $audits = $audits->paginate($validated['per_page'] ?? 10);
        $audits = AuditResource::collection($audits);
        return ApiHelper::success($audits, 'Category audit history retrieved successfully');
    }

    /**
     * Store a newly created resource in storage.
     * @param StoreCategoryRequest $request
     * 
     * @return JsonResponse
     */
    public function store(StoreCategoryRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            $category = Category::create($validated);
            return ApiHelper::success(new CategoryResource($category), 'Category created successfully');

        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred while creating the category.', 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category): JsonResponse
    {
        if (Gate::denies('categories.view')) {
            return ApiHelper::error('You dont have access to this resource', 403);
        }

        return ApiHelper::success(new CategoryResource($category), 'Category retrieved successfully');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, Category $category): JsonResponse
    {
        try {

            $validated = $request->validated();
            $category->update($validated);
            return ApiHelper::success(new CategoryResource($category), 'Category updated successfully');

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while updating the category.',
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category): JsonResponse
    {
        try {
            if (Gate::denies('categories.delete')) {
                return ApiHelper::error('You dont have access to this resource', 403);
            }

            $category->delete();
            return ApiHelper::success(message: 'Category deleted successfully');

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while deleting the category.',
            ], 500);
        }
    }
}
