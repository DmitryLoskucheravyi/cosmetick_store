<?php

require_once __DIR__ . '/../controllers/productController.php';

$requestMethod = $_SERVER['REQUEST_METHOD'];

$requestUri = parse_url(
    $_SERVER['REQUEST_URI'],
    PHP_URL_PATH
);

if ($requestMethod === 'GET' && $requestUri === '/api/products') {

    ProductController::getProducts();
}

if ($requestMethod === 'GET' && $requestUri === '/api/products/show') {

    ProductController::getProduct();
}

if ($requestMethod === 'POST' && $requestUri === '/api/products/create') {

    ProductController::createProduct();
}

if ($requestMethod === 'POST' && $requestUri === '/api/products/update') {

    ProductController::updateProduct();
}

if ($requestMethod === 'DELETE' && $requestUri === '/api/products/delete') {

    ProductController::deleteProduct();
}