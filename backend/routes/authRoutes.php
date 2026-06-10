<?php

require_once __DIR__ . '/../controllers/authController.php';

$requestMethod = $_SERVER['REQUEST_METHOD'];

$requestUri = parse_url(
    $_SERVER['REQUEST_URI'],
    PHP_URL_PATH
);

if ($requestMethod === 'POST' && $requestUri === '/api/auth/register') {

    AuthController::register();
}

if ($requestMethod === 'POST' && $requestUri === '/api/auth/login') {

    AuthController::login();
}

if ($requestMethod === 'GET' && $requestUri === '/api/auth/me') {

    AuthController::currentUser();
}