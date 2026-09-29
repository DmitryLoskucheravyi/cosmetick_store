<?php

declare(strict_types=1);

namespace Vt241\Backend\Http\Controllers;

use Vt241\Backend\Core\Request;
use Vt241\Backend\Core\Response;
use Vt241\Backend\Http\Middleware\AdminMiddleware;
use Vt241\Backend\Services\ProductService;

final class ProductController
{
    public function __construct(
        private readonly ProductService $products,
        private readonly AdminMiddleware $adminMiddleware
    ) {
    }

    public function index(Request $request): Response
    {
        $filters = [
            'search' => trim((string) $request->query('search', '')),
            'category' => $request->query('category', ''),
            'minPrice' => $request->query('minPrice', ''),
            'maxPrice' => $request->query('maxPrice', ''),
            'stock' => $request->query('stock', ''),
            'sort' => $request->query('sort', 'newest'),
        ];

        $result = $this->products->list(
            $filters,
            (int) $request->query('page', 1),
            (int) $request->query('limit', 10)
        );

        return Response::success($result, 'Products fetched');
    }

    public function priceRange(Request $request): Response
    {
        return Response::success($this->products->priceRange(), 'Price range fetched');
    }

    public function show(Request $request, array $params): Response
    {
        return Response::success($this->products->find((int) $params['id']), 'Product fetched');
    }

    public function store(Request $request): Response
    {
        $this->adminMiddleware->checkAdmin($request);

        $this->products->create($this->productData($request), $request->file('image'));

        return Response::success([], 'Product created', 201);
    }

    public function update(Request $request, array $params): Response
    {
        $this->adminMiddleware->checkAdmin($request);

        $this->products->update((int) $params['id'], $this->productData($request), $request->file('image'));

        return Response::success([], 'Product updated');
    }

    public function destroy(Request $request, array $params): Response
    {
        $this->adminMiddleware->checkAdmin($request);

        $this->products->delete((int) $params['id']);

        return Response::success([], 'Product deleted');
    }

    private function productData(Request $request): array
    {
        return [
            'title' => $request->post('title'),
            'description' => $request->post('description'),
            'price' => $request->post('price'),
            'categoryId' => $request->post('categoryId'),
            'stock' => $request->post('stock'),
        ];
    }
}
