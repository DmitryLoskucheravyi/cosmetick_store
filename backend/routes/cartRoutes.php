<?php

require_once __DIR__ . '/../controllers/cartController.php';

$requestMethod = $_SERVER['REQUEST_METHOD'];

$requestUri = parse_url(
    $_SERVER['REQUEST_URI'],
    PHP_URL_PATH
);

if (
    $requestMethod === 'GET' &&
    $requestUri === '/api/cart'
) {

    CartController::getCart();
}

if (
    $requestMethod === 'POST' &&
    $requestUri === '/api/cart/add'
) {

    CartController::addToCart();
}

if (
    $requestMethod === 'PUT' &&
    $requestUri === '/api/cart/update'
) {

    CartController::updateQuantity();
}

if (
    $requestMethod === 'DELETE' &&
    $requestUri === '/api/cart/remove'
) {

    CartController::removeFromCart();
}

if (
    $requestMethod === 'DELETE' &&
    $requestUri === '/api/cart/clear'
) {

    CartController::clearCart();
}