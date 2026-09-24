<?php

declare(strict_types=1);

namespace Vt241\Backend\Http\Controllers;

use Vt241\Backend\Core\Request;
use Vt241\Backend\Core\Response;
use Vt241\Backend\Http\Middleware\AuthMiddleware;
use Vt241\Backend\Services\AuthService;

final class AuthController
{
    public function __construct(
        private readonly AuthService $authService,
        private readonly AuthMiddleware $authMiddleware
    ) {
    }

    public function register(Request $request): Response
    {
        $data = $request->json();

        $result = $this->authService->register(
            (string) ($data['name'] ?? ''),
            (string) ($data['email'] ?? ''),
            (string) ($data['password'] ?? '')
        );

        return Response::success($result, 'User registered successfully', 201);
    }

    public function login(Request $request): Response
    {
        $data = $request->json();

        $result = $this->authService->login(
            (string) ($data['email'] ?? ''),
            (string) ($data['password'] ?? '')
        );

        return Response::success($result, 'Login successful');
    }

    public function me(Request $request): Response
    {
        $user = $this->authMiddleware->authenticate($request);

        return Response::success($this->authService->currentUser($user->id), 'Current user');
    }
}
