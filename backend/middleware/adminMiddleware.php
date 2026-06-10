<?php

require_once __DIR__ . '/authMiddleware.php';

class AdminMiddleware
{
    public static function checkAdmin()
    {
        $user = AuthMiddleware::authenticate();

        if ($user->role !== 'admin') {

            ResponseHelper::error(
                "Admin access required",
                403
            );
        }

        return $user;
    }
}