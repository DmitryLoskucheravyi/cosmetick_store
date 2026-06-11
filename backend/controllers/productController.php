<?php

require_once __DIR__ . '/../config/database.php';

require_once __DIR__ . '/../helpers/responseHelper.php';
require_once __DIR__ . '/../helpers/uploadHelper.php';

class ProductController
{
   public static function getProducts()
{
$database = Database::connect();

$search = trim($_GET['search'] ?? '');
$category = $_GET['category'] ?? '';
$minPrice = $_GET['minPrice'] ?? '';
$maxPrice = $_GET['maxPrice'] ?? '';
$stock = $_GET['stock'] ?? '';
$sort = $_GET['sort'] ?? 'newest';

$page = max(1, (int)($_GET['page'] ?? 1));
$limit = max(1, (int)($_GET['limit'] ?? 10));

$offset = ($page - 1) * $limit;

$sql = "
    SELECT
        p.*,
        c.name AS categoryName
    FROM products p
    INNER JOIN categories c
        ON c.id = p.categoryId
    WHERE 1=1
";

$params = [];

if ($search) {

    $sql .= " AND p.title LIKE ?";
    $params[] = "%{$search}%";
}

if ($category) {

    $sql .= " AND p.categoryId = ?";
    $params[] = $category;
}

if ($minPrice !== '') {

    $sql .= " AND p.price >= ?";
    $params[] = $minPrice;
}

if ($maxPrice !== '') {

    $sql .= " AND p.price <= ?";
    $params[] = $maxPrice;
}

if ($stock === 'in-stock') {

    $sql .= " AND p.stock > 0";
}

if ($stock === 'out-of-stock') {

    $sql .= " AND p.stock = 0";
}

if ($stock === 'low-stock') {

    $sql .= " AND p.stock BETWEEN 1 AND 5";
}

$countSql = str_replace(
    "SELECT
        p.*,
        c.name AS categoryName",
    "SELECT COUNT(*)",
    $sql
);

$countStmt = $database->prepare($countSql);
$countStmt->execute($params);

$total = $countStmt->fetchColumn();

switch ($sort) {

    case 'price-asc':
        $sql .= " ORDER BY p.price ASC";
        break;

    case 'price-desc':
        $sql .= " ORDER BY p.price DESC";
        break;

    case 'name-asc':
        $sql .= " ORDER BY p.title ASC";
        break;

    case 'name-desc':
        $sql .= " ORDER BY p.title DESC";
        break;

    default:
        $sql .= " ORDER BY p.createdAt DESC";
}

$sql .= " LIMIT {$limit} OFFSET {$offset}";

$stmt = $database->prepare($sql);
$stmt->execute($params);

$products = $stmt->fetchAll(PDO::FETCH_ASSOC);

ResponseHelper::success(
    [
        "products" => $products,
        "pagination" => [
            "page" => $page,
            "limit" => $limit,
            "total" => (int)$total,
            "pages" => ceil($total / $limit)
        ]
    ],
    "Products fetched"
);

}


    public static function getProduct($id = null)
{
     $database = Database::connect();

    if (!$id) {
        $id = $_GET['id'] ?? null;
    }

    if (!$id) {

        ResponseHelper::error(
            "Product ID required",
            400
        );
    }

    $stmt = $database->prepare(
        "SELECT
            p.*,
            c.name AS categoryName
         FROM products p
         INNER JOIN categories c
            ON c.id = p.categoryId
         WHERE p.id = ?"
    );

    $stmt->execute([$id]);

    $product = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$product) {

        ResponseHelper::error(
            "Product not found",
            404
        );
    }

    ResponseHelper::success(
        $product,
        "Product fetched"
    );
}

    public static function createProduct()
    {

        require_once __DIR__ . '/../middleware/adminMiddleware.php';

        AdminMiddleware::checkAdmin();

        $database = Database::connect();

        $title = trim($_POST['title'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $price = trim($_POST['price'] ?? '');
        $categoryId = trim($_POST['categoryId'] ?? '');
        $stock = trim($_POST['stock'] ?? '');

        if (
            !$title ||
            !$description ||
            !$price ||
            !$categoryId
        ) {

            ResponseHelper::error(
                "All fields required",
                400
            );
        }

        $imagePath = null;

        if (isset($_FILES['image'])) {

            $imagePath = UploadHelper::uploadProductImage(
                $_FILES['image']
            );
        }

        $stmt = $database->prepare(
            "INSERT INTO products
            (title, description, price, categoryId, image, stock)
            VALUES (?, ?, ?, ?, ?, ?)"
        );

        $stmt->execute([
            $title,
            $description,
            $price,
            $categoryId,
            $imagePath,
            $stock
        ]);

        ResponseHelper::success(
            [],
            "Product created",
            201
        );
    }

    public static function updateProduct()
    {
        require_once __DIR__ . '/../middleware/adminMiddleware.php';

        AdminMiddleware::checkAdmin();

        $database = Database::connect();

        $id = $_POST['id'] ?? null;

        if (!$id) {

            ResponseHelper::error(
                "Product ID required",
                400
            );
        }

        $stmt = $database->prepare(
            "SELECT * FROM products WHERE id = ?"
        );

        $stmt->execute([$id]);

        $existingProduct = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$existingProduct) {

            ResponseHelper::error(
                "Product not found",
                404
            );
        }

        $title = trim($_POST['title'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $price = trim($_POST['price'] ?? '');
        $categoryId = trim($_POST['categoryId'] ?? '');
        $stock = trim($_POST['stock'] ?? '');

        $imagePath = $existingProduct['image'];

        if (
            isset($_FILES['image']) &&
            $_FILES['image']['tmp_name']
        ) {

            if ($existingProduct['image']) {

                UploadHelper::deleteImage(
                    $existingProduct['image']
                );
            }

            $imagePath = UploadHelper::uploadProductImage(
                $_FILES['image']
            );
        }

        $updateStmt = $database->prepare(
            "UPDATE products
             SET title = ?,
                 description = ?,
                 price = ?,
                 categoryId = ?,
                 image = ?,
                 stock = ?
             WHERE id = ?"
        );

        $updateStmt->execute([
            $title,
            $description,
            $price,
            $categoryId,
            $imagePath,
            $stock,
            $id
        ]);

        ResponseHelper::success(
            [],
            "Product updated"
        );
    }

    public static function deleteProduct($id = null)
    {
        require_once __DIR__ . '/../middleware/adminMiddleware.php';

        AdminMiddleware::checkAdmin();

        $database = Database::connect();

        if (!$id) {
            $id = $_GET['id'] ?? null;
        }

        if (!$id) {

            ResponseHelper::error(
                "Product ID required",
                400
            );
        }

        $stmt = $database->prepare(
            "SELECT * FROM products WHERE id = ?"
        );

        $stmt->execute([$id]);

        $product = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$product) {

            ResponseHelper::error(
                "Product not found",
                404
            );
        }

        if ($product['image']) {

            UploadHelper::deleteImage(
                $product['image']
            );
        }

        $deleteStmt = $database->prepare(
            "DELETE FROM products WHERE id = ?"
        );

        $deleteStmt->execute([$id]);

        ResponseHelper::success(
            [],
            "Product deleted"
        );
    }
}