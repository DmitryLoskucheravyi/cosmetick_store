<?php

$path = parse_url(
    $_SERVER['REQUEST_URI'],
    PHP_URL_PATH
);

if (
    strpos($path, '/uploads/') === 0
) {

    $file = __DIR__ . $path;

    if (file_exists($file)) {
        return false;
    }
}

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/vendor/autoload.php';

require_once __DIR__ . '/config/cors.php';

require_once __DIR__ . '/helpers/responseHelper.php';

header('Content-Type: application/json');

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$requestUri = parse_url(
    $_SERVER['REQUEST_URI'],
    PHP_URL_PATH
);

if ($requestUri === '/api') {

    ResponseHelper::success(
        [],
        "Cosmetics Shop API Running"
    );
}

if (strpos($requestUri, '/api/auth') === 0) {

    require_once __DIR__ . '/routes/authRoutes.php';
    exit();
}

if (strpos($requestUri, '/api/products') === 0) {

    require_once __DIR__ . '/routes/productRoutes.php';
    exit();
}

if (strpos($requestUri, '/api/categories') === 0) {

    require_once __DIR__ . '/routes/categoryRoutes.php';
    exit();
}

if (strpos($requestUri, '/api/orders') === 0) {

    require_once __DIR__ . '/routes/orderRoutes.php';
    exit();
}

if (strpos($requestUri, '/api/users') === 0) {

    require_once __DIR__ . '/routes/userRoutes.php';
    exit();
}

if (strpos($requestUri, '/api/cart') === 0) {

    require_once __DIR__ . '/routes/cartRoutes.php';
    exit();
}
if (strpos($requestUri, '/api/admin') === 0) {

    require_once __DIR__ . '/routes/adminRoutes.php';
    exit();
}

ResponseHelper::error(
    "Route not found",
    404
);