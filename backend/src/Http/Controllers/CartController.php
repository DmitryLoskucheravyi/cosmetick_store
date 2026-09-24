<?php

declare(strict_types=1);

namespace Vt241\Backend\Http\Controllers;

use Vt241\Backend\Core\Request;
use Vt241\Backend\Core\Response;
use Vt241\Backend\Http\Middleware\AuthMiddleware;
use Vt241\Backend\Services\CartService;

final class CartController
{
    public function __construct(
        private readonly CartService $cart,
        private readonly AuthMiddleware $authMiddleware
    ) {
    }

    public function index(Request $request): Response
    {
        $user = $this->authMiddleware->authenticate($request);

        return Response::success($this->cart->get($user->id), 'Cart fetched');
    }

    public function store(Request $request): Response
    {
        $user = $this->authMiddleware->authenticate($request);

        $this->cart->add($user->id, $request->json()['productId'] ?? null);

        return Response::success([], 'Product added to cart');
    }

    public function update(Request $request, array $params): Response
    {
        $user = $this->authMiddleware->authenticate($request);

        $this->cart->updateQuantity($user->id, $params['productId'], $request->json()['quantity'] ?? null);

        return Response::success([], 'Cart updated');
    }

    public function destroy(Request $request, array $params): Response
    {
        $user = $this->authMiddleware->authenticate($request);

        $this->cart->remove($user->id, $params['productId']);

        return Response::success([], 'Product removed');
    }

    public function clear(Request $request): Response
    {
        $user = $this->authMiddleware->authenticate($request);

        $this->cart->clear($user->id);

        return Response::success([], 'Cart cleared');
    }
}
