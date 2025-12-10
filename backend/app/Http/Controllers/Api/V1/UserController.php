<?php

namespace App\Http\Controllers\Api\V1;

use App\Helpers\ApiHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\GetUserRequest;
use App\Http\Requests\Api\V1\StoreUserRequest;
use App\Http\Requests\Api\V1\UpdateUserRequest;
use App\Http\Resources\Api\V1\AuditResource;
use App\Http\Resources\Api\V1\UserResource;
use App\Models\User;
use DB;
use Gate;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(GetUserRequest $request): JsonResponse
    {
        try {
            $users = User::query();

            $validated = $request->validated();
            $perPage = $validated['per_page'] ?? 10;
            if (isset($validated['sort_by']) && isset($validated['sort_order'])) {
                $users->orderBy($validated['sort_by'], $validated['sort_order']);
            } else {
                $users->orderBy('created_at', 'desc');
            }

            if (isset($validated['status'])) {
                if ($validated['status'] === 'deactivated') {
                    $users->onlyTrashed();
                } else if ($validated['status'] === 'all') {
                    $users->withTrashed();
                }
            }

            if (isset($validated['name'])) {
                $users->where('name', 'like', '%' . $validated['name'] . '%');
            }
            if (isset($validated['email'])) {
                $users->where('email', 'like', '%' . $validated['email'] . '%');
            }
            $users->with('roles');
            $paginatedUsers = $users->paginate($perPage);
            $paginatedUsers = UserResource::collection($paginatedUsers);

            return ApiHelper::success($paginatedUsers, 'Users retrieved successfully');
        } catch (\Exception $e) {
            \Log::error($e);
            return ApiHelper::error('An error occurred while fetching.', 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            DB::beginTransaction();

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => bcrypt($validated['password']),
            ]);

            $user->assignRole($validated['role']);
            $rolePermissions = $user->getPermissionsViaRoles()->pluck('name')->toArray();
            $user->syncPermissions($rolePermissions);
            $user->load('roles');

            DB::commit();

            return ApiHelper::success(new UserResource($user), 'User created successfully');
        } catch (\Exception $e) {
            \Log::error($e);
            return ApiHelper::error('An error occurred while creating the user.', 500);
        }
    }

    public function auditHistory(GetUserRequest $request, $userId): JsonResponse
    {
        try {
            if (Gate::denies('users.view') && auth()->id() !== $userId) {
                return ApiHelper::error('You dont have access to this resource', 403);
            }

            $user = User::withTrashed()->findOrFail($userId);

            // only allow viewing trashed users if authorized
            if ($user->trashed() && Gate::denies('users.view')) {
                return ApiHelper::error('Unauthorized', 403);
            }
            $validated = $request->validated();

            $audits = $user->audits()->with('user');

            if (isset($validated['sort_by']) && isset($validated['sort_order'])) {
                $audits->orderBy($validated['sort_by'], $validated['sort_order']);
            } else {
                $audits->orderBy('created_at', 'desc');
            }
            $audits = $audits->paginate($validated['per_page'] ?? 10);
            $audits = AuditResource::collection($audits);

            return ApiHelper::success($audits, 'User audit history retrieved successfully');
        } catch (\Exception $e) {
            \Log::error($e);
            return ApiHelper::error('An error occurred while fetching audit history.', 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $userId): JsonResponse
    {
        try {
            if (Gate::denies('users.view') && auth()->id() !== $userId) {
                return ApiHelper::error('You dont have access to this resource', 403);
            }

            $user = User::withTrashed()->findOrFail($userId);

            // only allow viewing trashed users if authorized
            if ($user->trashed() && Gate::denies('users.view')) {
                return ApiHelper::error('Unauthorized', 403);
            }
            $user->load('roles');

            return ApiHelper::success(new UserResource($user), 'User retrieved successfully');
        } catch (\Exception $e) {
            \Log::error($e);
            return ApiHelper::error('An error occurred while fetching the user.', 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        try {
            $validated = $request->validated();

            if (isset($validated['name'])) {
                $user->name = $validated['name'];
            }
            if (isset($validated['email'])) {
                $user->email = $validated['email'];
            }
            if (isset($validated['password'])) {
                $user->password = bcrypt($validated['password']);
            }

            DB::beginTransaction();
            $user->save();

            if (isset($validated['role'])) {
                $user->syncRoles([$validated['role']]);
                $rolePermissions = $user->getPermissionsViaRoles()->pluck('name')->toArray();
                $user->syncPermissions($rolePermissions);
            }
            DB::commit();
            $user->load('roles');

            return ApiHelper::success(new UserResource($user), 'User updated successfully');
        } catch (\Exception $e) {
            \Log::error($e);
            return ApiHelper::error('An error occurred while updating the user.', 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user): JsonResponse
    {
        try {
            if (Gate::denies('users.delete')) {
                return ApiHelper::error('Unauthorized', 403);
            }

            $user->delete();
            return ApiHelper::success(null, 'User deleted successfully');
        } catch (\Exception $e) {
            \Log::error($e);
            return ApiHelper::error('An error occurred while deleting the user.', 500);
        }
    }

    public function restore(string $userId): JsonResponse
    {
        try {
            if (Gate::denies('users.delete')) {
                return ApiHelper::error('Unauthorized', 403);
            }

            $user = User::withTrashed()->findOrFail($userId);
            $user->restore();

            return ApiHelper::success(new UserResource($user), 'User restored successfully');
        } catch (\Exception $e) {
            \Log::error($e);
            return ApiHelper::error('An error occurred while restoring the user.', 500);
        }
    }
}
