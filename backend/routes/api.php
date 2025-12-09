<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\V1\SupplyController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;



Route::prefix('v1')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    })->middleware('auth:sanctum');
    Route::post('/auth/login', [AuthController::class, 'login'])->name('login');
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout'])->name('logout');

        // Category Routes
        Route::apiResource('categories', CategoryController::class);
        Route::get('categories/{category}/audits', [CategoryController::class, 'auditHistory'])->name('categories.view');

        // Product Routes
        Route::apiResource('products', ProductController::class);
        Route::get('products/{product}/audits', [ProductController::class, 'auditHistory'])->name('products.view');

        Route::get('supply/', [SupplyController::class, 'index']);
        Route::get('supply/{supply_flow_id}', [SupplyController::class, 'show']);

    });
});