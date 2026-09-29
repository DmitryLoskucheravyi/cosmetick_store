<?php

declare(strict_types=1);

namespace Vt241\Backend\Http\Controllers;

use Vt241\Backend\Core\Request;
use Vt241\Backend\Core\Response;
use Vt241\Backend\Http\Middleware\AuthMiddleware;
use Vt241\Backend\Services\ReviewService;

final class ReviewController
{
    public function __construct(
        private readonly ReviewService $reviews,
        private readonly AuthMiddleware $authMiddleware
    ) {
    }

    public function index(Request $request, array $params): Response
    {
        return Response::success($this->reviews->list((int) $params['id']), 'Reviews fetched');
    }

    public function store(Request $request, array $params): Response
    {
        $user = $this->authMiddleware->optional($request);

        $review = $this->reviews->create((int) $params['id'], $user, $request->json());

        return Response::success($review, 'Review posted', 201);
    }
}
