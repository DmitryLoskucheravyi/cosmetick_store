<?php

require_once __DIR__ . '/../controllers/orderController.php';

$requestMethod = $_SERVER['REQUEST_METHOD'];

$requestUri = parse_url(
    $_SERVER['REQUEST_URI'],
    PHP_URL_PATH
);

if (
    $requestMethod === 'POST' &&
    $requestUri === '/api/orders/create'
) {

    OrderController::createOrder();
}

if (
    $requestMethod === 'GET' &&
    $requestUri === '/api/orders/my'
) {

    OrderController::getMyOrders();
}

if (
    $requestMethod === 'GET' &&
    $requestUri === '/api/orders'
) {

    OrderController::getAllOrders();
}

if (
    $requestMethod === 'PUT' &&
    $requestUri === '/api/orders/status'
) {

    OrderController::updateStatus();
}