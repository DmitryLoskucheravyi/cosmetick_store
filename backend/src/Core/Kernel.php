<?php

declare(strict_types=1);

namespace Vt241\Backend\Core;

use PDOException;
use RuntimeException;
use Throwable;
use Vt241\Backend\Exceptions\HttpException;

/**
 * Single place that turns any exception into a JSON response.
 * Fixes bug #6 (unhandled PDO exceptions -> empty 500) and bug #7
 * (die() on connection failure leaking host/user in the response).
 */
final class Kernel
{
    public function __construct(private readonly Router $router)
    {
    }

    public function handle(Request $request): Response
    {
        try {
            return $this->router->dispatch($request);
        } catch (HttpException $e) {
            return Response::error($e->getMessage(), $e->getCode());
        } catch (RuntimeException $e) {
            // Thrown by Database on connection failure with a safe, generic message.
            error_log('[RUNTIME ERROR] ' . $e->getMessage());

            return Response::error($e->getMessage(), 500);
        } catch (PDOException $e) {
            error_log('[DB ERROR] ' . $e->getMessage());

            if ($e->getCode() === '23000') {
                return Response::error('Conflict: related data exists or is invalid', 409);
            }

            return Response::error('Database error', 500);
        } catch (Throwable $e) {
            error_log('[ERROR] ' . $e->getMessage());

            return Response::error('Internal server error', 500);
        }
    }
}
