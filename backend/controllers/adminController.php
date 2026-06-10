<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/responseHelper.php';
require_once __DIR__ . '/../middleware/adminMiddleware.php';

class AdminController
{
    public static function dashboard()
    {
        AdminMiddleware::checkAdmin();

        $database = Database::connect();

        $productsCount = $database->query(
            "SELECT COUNT(*) as total FROM products"
        )->fetch(PDO::FETCH_ASSOC);

        $categoriesCount = $database->query(
            "SELECT COUNT(*) as total FROM categories"
        )->fetch(PDO::FETCH_ASSOC);

        $usersCount = $database->query(
            "SELECT COUNT(*) as total FROM users"
        )->fetch(PDO::FETCH_ASSOC);

        $ordersCount = $database->query(
            "SELECT COUNT(*) as total FROM orders"
        )->fetch(PDO::FETCH_ASSOC);

        $sales = $database->query(
            "SELECT COALESCE(SUM(totalPrice),0) as total
             FROM orders"
        )->fetch(PDO::FETCH_ASSOC);

        $latestOrders = $database->query(
            "SELECT
                o.id,
                o.totalPrice,
                o.status,
                o.createdAt,
                u.name,
                u.email
             FROM orders o
             INNER JOIN users u
                ON u.id = o.userId
             ORDER BY o.createdAt DESC
             LIMIT 5"
        )->fetchAll(PDO::FETCH_ASSOC);

        ResponseHelper::success(
            [
                "products" => (int)$productsCount['total'],
                "categories" => (int)$categoriesCount['total'],
                "users" => (int)$usersCount['total'],
                "orders" => (int)$ordersCount['total'],
                "sales" => (float)$sales['total'],
                "latestOrders" => $latestOrders
            ],
            "Dashboard data"
        );
    }
}