<?php

declare(strict_types=1);

namespace Vt241\Backend\Http\Middleware;

use Vt241\Backend\Core\Request;
use Vt241\Backend\Entities\User;
use Vt241\Backend\Exceptions\UnauthorizedException;
use Vt241\Backend\Repositories\UserRepositoryInterface;
use Vt241\Backend\Services\JwtService;

/**
 * An ordinary, constructor-injected object instead of a bag of static
 * methods. Fixes bug #4: the token is read case-insensitively via
 * Request::bearerToken(), so a lowercase "authorization" header
 * (sent by HTTP/2 clients and many proxies) is no longer rejected.
 */
final class AuthMiddleware
{
    public function __construct(
        private readonly JwtService $jwt,
        private readonly UserRepositoryInterface $users
    ) {
    }

    public function authenticate(Request $request): User
    {
        $token = $request->bearerToken();

        if (!$token) {
            throw new UnauthorizedException('Access denied');
        }

        $decoded = $this->jwt->verify($token);

        if (!$decoded) {
            throw new UnauthorizedException('Invalid token');
        }

        $user = $this->users->findById((int) $decoded->id);

        if (!$user) {
            throw new UnauthorizedException('Invalid token');
        }

        return $user;
    }
}
