<?php

require_once __DIR__ . '/../controllers/categoryController.php';

$requestMethod = $_SERVER['REQUEST_METHOD'];

$requestUri = parse_url(
    $_SERVER['REQUEST_URI'],
    PHP_URL_PATH
);

if (
    $requestMethod === 'GET' &&
    $requestUri === '/api/categories'
) {

    CategoryController::getCategories();
}

if (
    $requestMethod === 'POST' &&
    $requestUri === '/api/categories/create'
) {

    CategoryController::createCategory();
}

if (
    $requestMethod === 'PUT' &&
    $requestUri === '/api/categories/update'
) {

    CategoryController::updateCategory();
}

if (
    $requestMethod === 'DELETE' &&
    $requestUri === '/api/categories/delete'
) {

    CategoryController::deleteCategory();
}