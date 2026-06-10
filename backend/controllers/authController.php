<?php

require_once __DIR__ . '/../config/database.php';

require_once __DIR__ . '/../helpers/responseHelper.php';
require_once __DIR__ . '/../helpers/jwtHelper.php';

class AuthController
{
    public static function register()
    {
        $database = Database::connect();

        $data = json_decode(
            file_get_contents("php://input"),
            true
        );

        $name = trim($data['name'] ?? '');
        $email = trim($data['email'] ?? '');
        $password = trim($data['password'] ?? '');

        if (!$name || !$email || !$password) {

            ResponseHelper::error(
                "All fields are required",
                400
            );
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {

            ResponseHelper::error(
                "Invalid email",
                400
            );
        }

        $checkStmt = $database->prepare(
            "SELECT * FROM users WHERE email = ?"
        );

        $checkStmt->execute([$email]);

        $existingUser = $checkStmt->fetch();

        if ($existingUser) {

            ResponseHelper::error(
                "Email already exists",
                400
            );
        }

        $hashedPassword = password_hash(
            $password,
            PASSWORD_DEFAULT
        );

        $stmt = $database->prepare(
            "INSERT INTO users(name, email, password, role)
             VALUES(?, ?, ?, ?)"
        );

        $stmt->execute([
            $name,
            $email,
            $hashedPassword,
            'user'
        ]);

        $userId = $database->lastInsertId();

        $user = [
            "id" => $userId,
            "name" => $name,
            "email" => $email,
            "role" => "user"
        ];

        $token = JwtHelper::generateToken($user);

        ResponseHelper::success(
            [
                "user" => $user,
                "token" => $token
            ],
            "User registered successfully",
            201
        );
    }

    public static function login()
    {
        $database = Database::connect();

        $data = json_decode(
            file_get_contents("php://input"),
            true
        );

        $email = trim($data['email'] ?? '');
        $password = trim($data['password'] ?? '');

        if (!$email || !$password) {

            ResponseHelper::error(
                "Email and password required",
                400
            );
        }

        $stmt = $database->prepare(
            "SELECT * FROM users WHERE email = ?"
        );

        $stmt->execute([$email]);

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {

            ResponseHelper::error(
                "Invalid credentials",
                401
            );
        }

        $passwordMatch = password_verify(
            $password,
            $user['password']
        );

        if (!$passwordMatch) {

            ResponseHelper::error(
                "Invalid credentials",
                401
            );
        }

        unset($user['password']);

        $token = JwtHelper::generateToken($user);

        ResponseHelper::success(
            [
                "user" => $user,
                "token" => $token
            ],
            "Login successful"
        );
    }

    public static function currentUser()
    {
        require_once __DIR__ . '/../middleware/authMiddleware.php';

        $decoded = AuthMiddleware::authenticate();

        $database = Database::connect();

        $stmt = $database->prepare(
            "SELECT id, name, email, role, createdAt
             FROM users
             WHERE id = ?"
        );

        $stmt->execute([$decoded->id]);

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {

            ResponseHelper::error(
                "User not found",
                404
            );
        }

        ResponseHelper::success(
            $user,
            "Current user"
        );
    }
}