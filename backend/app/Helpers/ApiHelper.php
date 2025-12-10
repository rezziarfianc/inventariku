<?php

namespace App\Helpers;

use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ApiHelper
{
    public static function response($data = null, $message = '', $status = true, $code = 200)
    {
        $pagination = null;
        if ($data instanceof AnonymousResourceCollection) {
            $pagination = [
                'total' => $data->total(),
                'per_page' => $data->perPage(),
                'current_page' => $data->currentPage(),
                'last_page' => $data->lastPage(),
                'from' => $data->firstItem(),
                'to' => $data->lastItem(),
                'links' => $data->linkCollection()->toArray(), // Add pagination links
            ];
        }

        if ($code === 422) {
            $response = [
                'success' => $status,
                'message' => $message,
                'errors' => $data,
            ];
        } else {
            $response = [
                'success' => $status,
                'message' => $message,
                'data' => $data,
            ];
        }


        if ($pagination) {
            $response['meta'] = $pagination;
        }

        return response()->json($response, $code);
    }

    public static function success($data = null, $message = 'Success', $code = 200)
    {
        return self::response($data, $message, true, $code);
    }

    public static function error($message = 'Error', $code = 400, $data = null)
    {
        return self::response($data, $message, false, $code);
    }

    public static function notFound($message = 'Resource Not Found', $data = null)
    {
        return self::response($data, $message, false, 404);
    }

    public static function unauthorized($message = 'Unauthorized', $data = null)
    {
        return self::response($data, $message, false, 401);
    }

    public static function forbidden($message = 'Forbidden', $data = null)
    {
        return self::response($data, $message, false, 403);
    }

    public static function validationError($message = 'Validation Error', $errors = null)
    {
        return self::response($errors, $message, false, 422);
    }
}