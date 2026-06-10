<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/responseHelper.php';

class CategoryController
{
    public static function getCategories()
    {
        $database = Database::connect();

        $stmt = $database->query(
            "SELECT * FROM categories ORDER BY name ASC"
        );

        $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);

        ResponseHelper::success(
            $categories,
            "Categories fetched"
        );
    }

    public static function createCategory()
    {
        require_once __DIR__ . '/../middleware/adminMiddleware.php';

        AdminMiddleware::checkAdmin();

        $database = Database::connect();

        $data = json_decode(
            file_get_contents("php://input"),
            true
        );

        $name = trim($data['name'] ?? '');

        if (!$name) {

            ResponseHelper::error(
                "Category name required",
                400
            );
        }

        $check = $database->prepare(
            "SELECT id FROM categories WHERE name = ?"
        );

        $check->execute([$name]);

        if ($check->fetch()) {

            ResponseHelper::error(
                "Category already exists",
                400
            );
        }

        $stmt = $database->prepare(
            "INSERT INTO categories(name)
             VALUES(?)"
        );

        $stmt->execute([$name]);

        ResponseHelper::success(
            [],
            "Category created",
            201
        );
    }

    public static function updateCategory()
    {
        require_once __DIR__ . '/../middleware/adminMiddleware.php';

        AdminMiddleware::checkAdmin();

        $database = Database::connect();

        $data = json_decode(
            file_get_contents("php://input"),
            true
        );

        $id = $data['id'] ?? null;
        $name = trim($data['name'] ?? '');

        if (!$id || !$name) {

            ResponseHelper::error(
                "Id and name required",
                400
            );
        }

        $stmt = $database->prepare(
            "UPDATE categories
             SET name = ?
             WHERE id = ?"
        );

        $stmt->execute([
            $name,
            $id
        ]);

        ResponseHelper::success(
            [],
            "Category updated"
        );
    }

    public static function deleteCategory()
    {
        require_once __DIR__ . '/../middleware/adminMiddleware.php';

        AdminMiddleware::checkAdmin();

        $database = Database::connect();

        $id = $_GET['id'] ?? null;

        if (!$id) {

            ResponseHelper::error(
                "Category id required",
                400
            );
        }

        $stmt = $database->prepare(
            "DELETE FROM categories
             WHERE id = ?"
        );

        $stmt->execute([$id]);

        ResponseHelper::success(
            [],
            "Category deleted"
        );
    }
}