<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JwtHelper
{
    public static function generateToken($user)
    {
        $payload = [
            "id" => $user['id'],
            "email" => $user['email'],
            "role" => $user['role'],
            "iat" => time(),
            "exp" => time() + (60 * 60 * 24 * 7)
        ];

        return JWT::encode(
            $payload,
            $_ENV['JWT_SECRET'],
            'HS256'
        );
    }

    public static function verifyToken($token)
    {
        try {

            return JWT::decode(
                $token,
                new Key($_ENV['JWT_SECRET'], 'HS256')
            );

        } catch (Exception $e) {

            return null;
        }
    }
}