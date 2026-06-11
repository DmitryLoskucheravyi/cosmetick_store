<?php

require_once __DIR__ . '/../controllers/orderController.php';

$requestMethod = $_SERVER['REQUEST_METHOD'];

$requestUri = parse_url(
    $_SERVER['REQUEST_URI'],
    PHP_URL_PATH
);

$segments = explode('/', trim($requestUri, '/'));

$orderId = null;

if (
    count($segments) === 3 &&
    $segments[0] === 'api' &&
    $segments[1] === 'orders'
) {
    $orderId = $segments[2];
}


if (
    $requestMethod === 'GET' &&
    $orderId &&
    is_numeric($orderId)
) {

    OrderController::getOrder(
        $orderId
    );
    exit();
}

if (
    $requestMethod === 'GET' &&
    $requestUri === '/api/orders/my'
) {

    OrderController::getMyOrders();
}

if (
    $requestMethod === 'GET' &&
    $orderId
) {

    OrderController::getOrder(
        $orderId
    );

    exit();
}

if (
    $requestMethod === 'POST' &&
    $requestUri === '/api/orders/create'
) {

    OrderController::createOrder();
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