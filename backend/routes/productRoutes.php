<?php

require_once __DIR__ . '/../controllers/productController.php';

$requestMethod = $_SERVER['REQUEST_METHOD'];

$requestUri = parse_url(
    $_SERVER['REQUEST_URI'],
    PHP_URL_PATH
);

$segments = explode('/', trim($requestUri, '/'));

$productId = null;

if (
    count($segments) === 3 &&
    $segments[0] === 'api' &&
    $segments[1] === 'products'
) {
    $productId = $segments[2];
}

if (
    $requestMethod === 'GET' &&
    $requestUri === '/api/products'
) {
    ProductController::getProducts();
    exit();
}

if (
    $requestMethod === 'GET' &&
    $productId
) {
    ProductController::getProduct($productId);
    exit();
}

if (
    $requestMethod === 'POST' &&
    $requestUri === '/api/products'
) {
    ProductController::createProduct();
    exit();
}

if (
    $requestMethod === 'PUT' &&
    $productId
) {
    ProductController::updateProduct();
    exit();
}

if (
    $requestMethod === 'DELETE' &&
    $productId
) {
    ProductController::deleteProduct($productId);
    exit();
}