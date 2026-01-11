<?php

use App\Http\Controllers\Api\V1\AnalyticsController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\BrandController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\NotificationController;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\V1\ReportController;
use App\Http\Controllers\Api\V1\RoleController;
use App\Http\Controllers\Api\V1\SupplyController;
use App\Http\Controllers\Api\V1\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::prefix('v1')->group(function () {
    Route::post('/auth/login', [AuthController::class, 'login'])->name('login');
    Route::middleware('auth:sanctum')->group(function () {

        Route::post('/auth/logout', [AuthController::class, 'logout'])->name('logout');

        // Category Routes
        Route::apiResource('categories', CategoryController::class);
        Route::get('categories/{category}/audits', [CategoryController::class, 'auditHistory'])->name('categories.view');

        // Product Routes
        Route::apiResource('products', ProductController::class);
        Route::get('products/{product}/audits', [ProductController::class, 'auditHistory'])->name('products.view');

        // Supply Routes
        Route::get('supply/', [SupplyController::class, 'index']);
        Route::get('supply/{supply_flow}', [SupplyController::class, 'show']);
        Route::post('supply/', [SupplyController::class, 'create']);

        // Brand Routes
        Route::apiResource('brands', BrandController::class);
        Route::get('brands/{brand}/audits', [BrandController::class, 'auditHistory'])->name('brands.view');

        // User Routes
        Route::apiResource('users', UserController::class);
        Route::get('users/{user}/audits', [UserController::class, 'auditHistory'])->name('users.view');
        Route::put('users/restore/{user}', [UserController::class, 'restore'])->name('users.restore');

        // Role Routes
        Route::get('roles', [RoleController::class, 'index'])->name('roles.index');

        // Analytics Routes
        Route::get('analytics/dashboard', [AnalyticsController::class, 'dashboard']);

        // Report Routes
        Route::get('reports/stock-movement', [ReportController::class, 'stockMovement']);
        Route::get('reports/stock-summary', [ReportController::class, 'stockSummary']);

        // Notification Routes
        Route::get('notifications', [NotificationController::class, 'index'])->name('notifications.index');
        Route::get('notifications/unread-count', [NotificationController::class, 'unreadCount'])->name('notifications.unread-count');
        Route::post('notifications/mark-all-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.mark-all-read');
        Route::post('notifications/{id}/mark-read', [NotificationController::class, 'markAsRead'])->name('notifications.mark-read');
        Route::delete('notifications/{id}', [NotificationController::class, 'destroy'])->name('notifications.destroy');

    });
});