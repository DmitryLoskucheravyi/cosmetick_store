<?php

declare(strict_types=1);

namespace Vt241\Backend\Http\Middleware;

use Vt241\Backend\Core\Request;
use Vt241\Backend\Entities\User;
use Vt241\Backend\Enums\UserRole;
use Vt241\Backend\Exceptions\ForbiddenException;

final class AdminMiddleware
{
    public function __construct(private readonly AuthMiddleware $auth)
    {
    }

    public function checkAdmin(Request $request): User
    {
        $user = $this->auth->authenticate($request);

        if ($user->role !== UserRole::Admin) {
            throw new ForbiddenException('Admin access required');
        }

        return $user;
    }
}
