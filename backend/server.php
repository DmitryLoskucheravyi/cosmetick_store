<?php

declare(strict_types=1);

require __DIR__ . '/vendor/autoload.php';

use Vt241\Backend\Bootstrap;
use Vt241\Backend\Core\Request;
use Vt241\Backend\Core\Response;

$path = (string) parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);

// Only relevant when running via `php -S`: let the built-in server hand
// back an existing upload file directly instead of routing it through us.
if (str_starts_with($path, '/uploads/') && is_file(__DIR__ . $path)) {
    return false;
}

try {
    $kernel = Bootstrap::createKernel(__DIR__);
    $kernel->handle(Request::fromGlobals())->send();
} catch (Throwable $e) {
    // Kernel only guards its own handle() call — a failure while building it
    // (e.g. the DB connection during Bootstrap) would otherwise reach PHP's
    // default handler, which prints a full stack trace *with constructor
    // arguments* — including the DB password — straight into the response.
    error_log('[BOOTSTRAP ERROR] ' . $e->getMessage());

    Response::error('Service temporarily unavailable', 503)->send();
}
