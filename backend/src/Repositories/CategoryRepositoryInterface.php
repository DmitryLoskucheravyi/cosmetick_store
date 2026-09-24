<?php

declare(strict_types=1);

namespace Vt241\Backend\Repositories;

use Vt241\Backend\Entities\Category;

interface CategoryRepositoryInterface
{
    /** @return Category[] */
    public function all(): array;

    public function findById(int $id): ?Category;

    public function findByName(string $name): ?Category;

    public function create(string $name): int;

    public function update(int $id, string $name): void;

    public function delete(int $id): void;

    public function hasProducts(int $id): bool;

    public function count(): int;
}
