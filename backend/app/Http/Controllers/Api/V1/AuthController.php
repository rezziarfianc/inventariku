<?php

namespace App\Http\Controllers\Api\V1;

use App\Helpers\ApiHelper;
use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->only('email', 'password');

        if (!auth()->attempt($credentials)) {
            return ApiHelper::error('Invalid credentials', 401);
        }

        $user = auth()->user();
        $user->load(['roles', 'permissions']);
        $user->getAllPermissions();
        $validUntil = now()->addHour();
        $token = $user->createToken('auth_token', expiresAt: $validUntil)->plainTextToken;

        return ApiHelper::success([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'valid_until' => $validUntil->toDateTimeString(),
            'user' => new UserResource($user),
        ], 'Login successful');
    }

    public function logout(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->currentAccessToken()->delete();

        return ApiHelper::success(message: 'Logout successful');
    }

}
