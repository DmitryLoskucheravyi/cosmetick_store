<?php

declare(strict_types=1);

namespace Vt241\Backend\Services;

use Vt241\Backend\Entities\Product;
use Vt241\Backend\Exceptions\NotFoundException;
use Vt241\Backend\Exceptions\ValidationException;
use Vt241\Backend\Repositories\CategoryRepositoryInterface;
use Vt241\Backend\Repositories\ProductRepositoryInterface;

final class ProductService
{
    // Fixes bug #12: a client can no longer ask for the whole catalog in one page.
    private const MAX_LIMIT = 50;

    public function __construct(
        private readonly ProductRepositoryInterface $products,
        private readonly CategoryRepositoryInterface $categories,
        private readonly ImageUploader $uploader
    ) {
    }

    public function list(array $filters, int $page, int $limit): array
    {
        $page = max(1, $page);
        $limit = min(self::MAX_LIMIT, max(1, $limit));
        $offset = ($page - 1) * $limit;

        $result = $this->products->paginate($filters, $limit, $offset);

        return [
            'products' => array_map(static fn (Product $p) => $p->toArray(), $result['items']),
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $result['total'],
                'pages' => $result['total'] > 0 ? (int) ceil($result['total'] / $limit) : 0,
            ],
        ];
    }

    public function priceRange(): array
    {
        return $this->products->priceRange();
    }

    public function find(int $id): array
    {
        $product = $this->products->findById($id);

        if (!$product) {
            throw new NotFoundException('Product not found');
        }

        return $product->toArray();
    }

    public function create(array $data, ?array $file): void
    {
        [$title, $description, $price, $categoryId, $stock] = $this->validate($data);

        $imagePath = $this->uploader->upload($file);

        $this->products->create(new Product(
            id: null,
            title: $title,
            description: $description,
            price: $price,
            categoryId: $categoryId,
            image: $imagePath,
            stock: $stock,
        ));
    }

    public function update(int $id, array $data, ?array $file): void
    {
        $existing = $this->products->findById($id);

        if (!$existing) {
            throw new NotFoundException('Product not found');
        }

        [$title, $description, $price, $categoryId, $stock] = $this->validate($data);

        // Fixes bug #10: only replace the image when a new file actually arrived.
        $imagePath = $existing->image;

        if ($file !== null) {
            $this->uploader->delete($existing->image);
            $imagePath = $this->uploader->upload($file);
        }

        $this->products->update($id, new Product(
            id: $id,
            title: $title,
            description: $description,
            price: $price,
            categoryId: $categoryId,
            image: $imagePath,
            stock: $stock,
        ));
    }

    public function delete(int $id): void
    {
        $product = $this->products->findById($id);

        if (!$product) {
            throw new NotFoundException('Product not found');
        }

        $this->products->delete($id);
    }

    /**
     * Fixes bug #11: create/update now share the same, actually
     * enforced validation (positive price, non-negative stock,
     * category must exist).
     *
     * @return array{0: string, 1: string, 2: float, 3: int, 4: int}
     */
    private function validate(array $data): array
    {
        $title = trim((string) ($data['title'] ?? ''));
        $description = trim((string) ($data['description'] ?? ''));
        $price = $data['price'] ?? '';
        $categoryId = $data['categoryId'] ?? '';
        $stock = $data['stock'] ?? '0';

        if ($title === '' || $description === '' || $price === '' || $categoryId === '') {
            throw new ValidationException('All fields are required');
        }

        if (!is_numeric($price) || (float) $price <= 0) {
            throw new ValidationException('Price must be a positive number');
        }

        if (!is_numeric($stock) || (int) $stock < 0) {
            throw new ValidationException('Stock must be zero or a positive number');
        }

        if (!ctype_digit((string) $categoryId) || !$this->categories->findById((int) $categoryId)) {
            throw new ValidationException('Category does not exist');
        }

        return [$title, $description, (float) $price, (int) $categoryId, (int) $stock];
    }
}
