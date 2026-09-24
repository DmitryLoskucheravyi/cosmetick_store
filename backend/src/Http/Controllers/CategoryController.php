<?php

declare(strict_types=1);

namespace Vt241\Backend\Http\Controllers;

use Vt241\Backend\Core\Request;
use Vt241\Backend\Core\Response;
use Vt241\Backend\Http\Middleware\AdminMiddleware;
use Vt241\Backend\Services\CategoryService;

final class CategoryController
{
    public function __construct(
        private readonly CategoryService $categories,
        private readonly AdminMiddleware $adminMiddleware
    ) {
    }

    public function index(Request $request): Response
    {
        return Response::success($this->categories->list(), 'Categories fetched');
    }

    public function store(Request $request): Response
    {
        $this->adminMiddleware->checkAdmin($request);

        $this->categories->create((string) ($request->json()['name'] ?? ''));

        return Response::success([], 'Category created', 201);
    }

    public function update(Request $request, array $params): Response
    {
        $this->adminMiddleware->checkAdmin($request);

        $this->categories->update((int) $params['id'], (string) ($request->json()['name'] ?? ''));

        return Response::success([], 'Category updated');
    }

    public function destroy(Request $request, array $params): Response
    {
        $this->adminMiddleware->checkAdmin($request);

        $this->categories->delete((int) $params['id']);

        return Response::success([], 'Category deleted');
    }
}
