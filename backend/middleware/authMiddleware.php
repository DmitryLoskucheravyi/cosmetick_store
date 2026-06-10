<?php

require_once __DIR__ . '/../helpers/jwtHelper.php';
require_once __DIR__ . '/../helpers/responseHelper.php';

class AuthMiddleware
{
    public static function authenticate()
    {
        $headers = getallheaders();

        if (!isset($headers['Authorization'])) {

            ResponseHelper::error(
                "Access denied",
                401
            );
        }

        $authHeader = $headers['Authorization'];

        $token = str_replace(
            'Bearer ',
            '',
            $authHeader
        );

        $decoded = JwtHelper::verifyToken($token);

        if (!$decoded) {

            ResponseHelper::error(
                "Invalid token",
                401
            );
        }

        return $decoded;
    }
}