<?php

declare(strict_types=1);

require __DIR__ . '/vendor/autoload.php';

use Vt241\Backend\Bootstrap;
use Vt241\Backend\Core\Request;

$path = (string) parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);

// Only relevant when running via `php -S`: let the built-in server hand
// back an existing upload file directly instead of routing it through us.
if (str_starts_with($path, '/uploads/') && is_file(__DIR__ . $path)) {
    return false;
}

$kernel = Bootstrap::createKernel(__DIR__);
$kernel->handle(Request::fromGlobals())->send();
