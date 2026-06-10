<?php

require_once __DIR__ . '/../controllers/adminController.php';

$requestMethod = $_SERVER['REQUEST_METHOD'];

$requestUri = parse_url(
    $_SERVER['REQUEST_URI'],
    PHP_URL_PATH
);

if (
    $requestMethod === 'GET' &&
    $requestUri === '/api/admin/dashboard'
) {

    AdminController::dashboard();
}