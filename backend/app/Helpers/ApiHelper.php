<?php

namespace App\Helpers;

class ApiHelper
{
    public static function response($data = null, $message = '', $status = true, $code = 200)
    {
        return response()->json([
            'success' => $status,
            'message' => $message,
            'data' => $data,
        ], $code);
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

    public static function validationError($message = 'Validation Error', $data = null)
    {
        return self::response($data, $message, false, 422);
    }
}