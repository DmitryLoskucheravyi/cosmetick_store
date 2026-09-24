<?php

declare(strict_types=1);

namespace Vt241\Backend\Http\Controllers;

use Vt241\Backend\Core\Request;
use Vt241\Backend\Core\Response;
use Vt241\Backend\Http\Middleware\AdminMiddleware;
use Vt241\Backend\Http\Middleware\AuthMiddleware;
use Vt241\Backend\Services\OrderService;

final class OrderController
{
    public function __construct(
        private readonly OrderService $orders,
        private readonly AuthMiddleware $authMiddleware,
        private readonly AdminMiddleware $adminMiddleware
    ) {
    }

    public function store(Request $request): Response
    {
        $user = $this->authMiddleware->authenticate($request);

        $orderId = $this->orders->checkout($user->id);

        return Response::success(['orderId' => $orderId], 'Order created');
    }

    public function myOrders(Request $request): Response
    {
        $user = $this->authMiddleware->authenticate($request);

        return Response::success($this->orders->myOrders($user->id), 'Orders fetched');
    }

    public function show(Request $request, array $params): Response
    {
        $user = $this->authMiddleware->authenticate($request);

        return Response::success($this->orders->getOrder((int) $params['id'], $user->id), 'Order fetched');
    }

    public function index(Request $request): Response
    {
        $this->adminMiddleware->checkAdmin($request);

        return Response::success($this->orders->allOrders(), 'All orders fetched');
    }

    public function updateStatus(Request $request, array $params): Response
    {
        $this->adminMiddleware->checkAdmin($request);

        $this->orders->updateStatus((int) $params['id'], (string) ($request->json()['status'] ?? ''));

        return Response::success([], 'Order updated');
    }
}
