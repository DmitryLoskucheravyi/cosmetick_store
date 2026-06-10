<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/responseHelper.php';
require_once __DIR__ . '/../middleware/authMiddleware.php';

class CartController
{
    public static function getCart()
    {
        $decoded = AuthMiddleware::authenticate();

        $database = Database::connect();

        $stmt = $database->prepare(
            "SELECT
                c.id,
                c.quantity,
                p.id AS productId,
                p.title,
                p.price,
                p.image,
                (p.price * c.quantity) AS total
             FROM cart c
             INNER JOIN products p
                ON p.id = c.productId
             WHERE c.userId = ?"
        );

        $stmt->execute([$decoded->id]);

        $cart = $stmt->fetchAll(PDO::FETCH_ASSOC);

        ResponseHelper::success(
            $cart,
            "Cart fetched"
        );
    }

    public static function addToCart()
    {
        $decoded = AuthMiddleware::authenticate();

        $database = Database::connect();

        $data = json_decode(
            file_get_contents("php://input"),
            true
        );

        $productId = $data['productId'] ?? null;

        if (!$productId) {

            ResponseHelper::error(
                "Product id required",
                400
            );
        }

        $checkStmt = $database->prepare(
            "SELECT *
             FROM cart
             WHERE userId = ?
             AND productId = ?"
        );

        $checkStmt->execute([
            $decoded->id,
            $productId
        ]);

        $existing = $checkStmt->fetch(PDO::FETCH_ASSOC);

        if ($existing) {

            $updateStmt = $database->prepare(
                "UPDATE cart
                 SET quantity = quantity + 1
                 WHERE id = ?"
            );

            $updateStmt->execute([
                $existing['id']
            ]);

        } else {

            $insertStmt = $database->prepare(
                "INSERT INTO cart
                 (userId, productId, quantity)
                 VALUES (?, ?, 1)"
            );

            $insertStmt->execute([
                $decoded->id,
                $productId
            ]);
        }

        ResponseHelper::success(
            [],
            "Product added to cart"
        );
    }

    public static function updateQuantity()
    {
        $decoded = AuthMiddleware::authenticate();

        $database = Database::connect();

        $data = json_decode(
            file_get_contents("php://input"),
            true
        );

        $productId = $data['productId'] ?? null;
        $quantity = $data['quantity'] ?? null;

        if (!$productId || !$quantity) {

            ResponseHelper::error(
                "Invalid data",
                400
            );
        }

        $stmt = $database->prepare(
            "UPDATE cart
             SET quantity = ?
             WHERE userId = ?
             AND productId = ?"
        );

        $stmt->execute([
            $quantity,
            $decoded->id,
            $productId
        ]);

        ResponseHelper::success(
            [],
            "Cart updated"
        );
    }

    public static function removeFromCart()
    {
        $decoded = AuthMiddleware::authenticate();

        $database = Database::connect();

        $productId = $_GET['productId'] ?? null;

        if (!$productId) {

            ResponseHelper::error(
                "Product id required",
                400
            );
        }

        $stmt = $database->prepare(
            "DELETE FROM cart
             WHERE userId = ?
             AND productId = ?"
        );

        $stmt->execute([
            $decoded->id,
            $productId
        ]);

        ResponseHelper::success(
            [],
            "Product removed"
        );
    }

    public static function clearCart()
    {
        $decoded = AuthMiddleware::authenticate();

        $database = Database::connect();

        $stmt = $database->prepare(
            "DELETE FROM cart
             WHERE userId = ?"
        );

        $stmt->execute([
            $decoded->id
        ]);

        ResponseHelper::success(
            [],
            "Cart cleared"
        );
    }
}