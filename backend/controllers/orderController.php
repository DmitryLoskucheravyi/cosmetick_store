<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/responseHelper.php';
require_once __DIR__ . '/../middleware/authMiddleware.php';

class OrderController
{
    public static function createOrder()
    {
        $decoded = AuthMiddleware::authenticate();

        $database = Database::connect();

        $cartStmt = $database->prepare(
            "SELECT
                c.productId,
                c.quantity,
                p.price,
                p.stock
             FROM cart c
             INNER JOIN products p
                ON p.id = c.productId
             WHERE c.userId = ?"
        );

        $cartStmt->execute([$decoded->id]);

        $cartItems = $cartStmt->fetchAll(PDO::FETCH_ASSOC);

        if (empty($cartItems)) {

            ResponseHelper::error(
                "Cart is empty",
                400
            );
        }

        $totalPrice = 0;

        foreach ($cartItems as $item) {

            if ($item['stock'] < $item['quantity']) {

                ResponseHelper::error(
                    "Not enough stock",
                    400
                );
            }

            $totalPrice += (
                $item['price'] *
                $item['quantity']
            );
        }

        $orderStmt = $database->prepare(
            "INSERT INTO orders
             (userId, totalPrice)
             VALUES (?, ?)"
        );

        $orderStmt->execute([
            $decoded->id,
            $totalPrice
        ]);

        $orderId = $database->lastInsertId();

        foreach ($cartItems as $item) {

            $itemStmt = $database->prepare(
                "INSERT INTO order_items
                (orderId, productId, quantity, price)
                VALUES (?, ?, ?, ?)"
            );

            $itemStmt->execute([
                $orderId,
                $item['productId'],
                $item['quantity'],
                $item['price']
            ]);

            $stockStmt = $database->prepare(
                "UPDATE products
                 SET stock = stock - ?
                 WHERE id = ?"
            );

            $stockStmt->execute([
                $item['quantity'],
                $item['productId']
            ]);
        }

        $clearCart = $database->prepare(
            "DELETE FROM cart
             WHERE userId = ?"
        );

        $clearCart->execute([
            $decoded->id
        ]);

        ResponseHelper::success(
            [
                "orderId" => $orderId
            ],
            "Order created"
        );
    }

    public static function getMyOrders()
    {
        $decoded = AuthMiddleware::authenticate();

        $database = Database::connect();

        $stmt = $database->prepare(
            "SELECT *
             FROM orders
             WHERE userId = ?
             ORDER BY createdAt DESC"
        );

        $stmt->execute([
            $decoded->id
        ]);

        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

        ResponseHelper::success(
            $orders,
            "Orders fetched"
        );
    }

    public static function getAllOrders()
    {
        require_once __DIR__ . '/../middleware/adminMiddleware.php';

        AdminMiddleware::checkAdmin();

        $database = Database::connect();

        $stmt = $database->query(
            "SELECT
                o.*,
                u.name,
                u.email
             FROM orders o
             INNER JOIN users u
                ON u.id = o.userId
             ORDER BY o.createdAt DESC"
        );

        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

        ResponseHelper::success(
            $orders,
            "All orders fetched"
        );
    }

    public static function updateStatus()
    {
        require_once __DIR__ . '/../middleware/adminMiddleware.php';

        AdminMiddleware::checkAdmin();

        $database = Database::connect();

        $data = json_decode(
            file_get_contents("php://input"),
            true
        );

        $orderId = $data['orderId'] ?? null;
        $status = $data['status'] ?? null;

        if (!$orderId || !$status) {

            ResponseHelper::error(
                "Invalid data",
                400
            );
        }

        $stmt = $database->prepare(
            "UPDATE orders
             SET status = ?
             WHERE id = ?"
        );

        $stmt->execute([
            $status,
            $orderId
        ]);

        ResponseHelper::success(
            [],
            "Order updated"
        );
    }
}