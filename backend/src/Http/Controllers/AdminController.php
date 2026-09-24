<?php

declare(strict_types=1);

namespace Vt241\Backend\Http\Controllers;

use Vt241\Backend\Core\Request;
use Vt241\Backend\Core\Response;
use Vt241\Backend\Http\Middleware\AdminMiddleware;
use Vt241\Backend\Repositories\CategoryRepositoryInterface;
use Vt241\Backend\Repositories\OrderRepositoryInterface;
use Vt241\Backend\Repositories\ProductRepositoryInterface;
use Vt241\Backend\Repositories\UserRepositoryInterface;

final class AdminController
{
    public function __construct(
        private readonly AdminMiddleware $adminMiddleware,
        private readonly ProductRepositoryInterface $products,
        private readonly CategoryRepositoryInterface $categories,
        private readonly UserRepositoryInterface $users,
        private readonly OrderRepositoryInterface $orders
    ) {
    }

    public function dashboard(Request $request): Response
    {
        $this->adminMiddleware->checkAdmin($request);

        return Response::success([
            'products' => $this->products->count(),
            'categories' => $this->categories->count(),
            'users' => $this->users->count(),
            'orders' => $this->orders->countAll(),
            'sales' => $this->orders->totalSales(),
            'latestOrders' => $this->orders->latest(5),
        ], 'Dashboard data');
    }
}
