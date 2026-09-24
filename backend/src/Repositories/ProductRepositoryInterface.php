<?php

declare(strict_types=1);

namespace Vt241\Backend\Repositories;

use Vt241\Backend\Entities\Product;

interface ProductRepositoryInterface
{
    /** @return array{items: Product[], total: int} */
    public function paginate(array $filters, int $limit, int $offset): array;

    public function findById(int $id): ?Product;

    public function create(Product $product): int;

    public function update(int $id, Product $product): void;

    /** Soft-deletes: sets isActive = 0 instead of removing the row (fixes bug #3). */
    public function delete(int $id): void;

    /** Atomically reserves stock; returns false when there isn't enough left. */
    public function decreaseStock(int $id, int $quantity): bool;

    public function increaseStock(int $id, int $quantity): void;

    public function count(): int;
}
