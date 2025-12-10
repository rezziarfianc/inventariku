<?php

namespace App\Http\Controllers\Api\V1;

use App\Helpers\ApiHelper;
use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\RoleResource;
use \Spatie\Permission\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $perPage = request()->get('per_page', 10);
            $roles = Role::orderBy('created_at', 'desc')->paginate($perPage);
            $roles = RoleResource::collection($roles);
            return ApiHelper::success($roles, 'Roles retrieved successfully');
        } catch (\Exception $e) {
            \Log::error($e);
            return ApiHelper::error('An error occurred while fetching.', 500);
        }
    }

}
