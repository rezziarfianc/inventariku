<?php

namespace App\Http\Controllers\Api\V1;

use App\Helpers\ApiHelper;
use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\NotificationResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Display a listing of notifications for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $notifications = $user->notifications();

            // Sorting
            $sortBy = $request->query('sort_by', 'created_at');
            $sortOrder = $request->query('sort_order', 'desc');
            $notifications->orderBy($sortBy, $sortOrder);

            // Filter by read status
            if ($request->has('unread_only') && $request->query('unread_only') === 'true') {
                $notifications->whereNull('read_at');
            }

            $perPage = $request->query('per_page', 10);
            $paginatedNotifications = $notifications->paginate($perPage);

            return ApiHelper::success(
                NotificationResource::collection($paginatedNotifications),
                'Notifications retrieved successfully'
            );
        } catch (\Exception $e) {
            \Log::error($e);
            return ApiHelper::error('An error occurred while fetching notifications.', 500);
        }
    }

    /**
     * Get count of unread notifications.
     */
    public function unreadCount(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $count = $user->unreadNotifications()->count();

            return ApiHelper::success(['count' => $count], 'Unread count retrieved successfully');
        } catch (\Exception $e) {
            \Log::error($e);
            return ApiHelper::error('An error occurred while fetching unread count.', 500);
        }
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $user->unreadNotifications->markAsRead();

            return ApiHelper::success(null, 'All notifications marked as read');
        } catch (\Exception $e) {
            \Log::error($e);
            return ApiHelper::error('An error occurred while marking notifications as read.', 500);
        }
    }

    /**
     * Mark a specific notification as read.
     */
    public function markAsRead(Request $request, string $id): JsonResponse
    {
        try {
            $user = $request->user();
            $notification = $user->notifications()->where('id', $id)->first();

            if (!$notification) {
                return ApiHelper::error('Notification not found.', 404);
            }

            $notification->markAsRead();

            return ApiHelper::success(
                new NotificationResource($notification),
                'Notification marked as read'
            );
        } catch (\Exception $e) {
            \Log::error($e);
            return ApiHelper::error('An error occurred while marking notification as read.', 500);
        }
    }

    /**
     * Delete a specific notification.
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        try {
            $user = $request->user();
            $notification = $user->notifications()->where('id', $id)->first();

            if (!$notification) {
                return ApiHelper::error('Notification not found.', 404);
            }

            $notification->delete();

            return ApiHelper::success(null, 'Notification deleted successfully');
        } catch (\Exception $e) {
            \Log::error($e);
            return ApiHelper::error('An error occurred while deleting notification.', 500);
        }
    }
}
