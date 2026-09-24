<?php

declare(strict_types=1);

namespace Vt241\Backend\Services;

use Vt241\Backend\Entities\Category;
use Vt241\Backend\Exceptions\ConflictException;
use Vt241\Backend\Exceptions\NotFoundException;
use Vt241\Backend\Exceptions\ValidationException;
use Vt241\Backend\Repositories\CategoryRepositoryInterface;

final class CategoryService
{
    public function __construct(private readonly CategoryRepositoryInterface $categories)
    {
    }

    public function list(): array
    {
        return array_map(
            static fn (Category $category) => $category->toArray(),
            $this->categories->all()
        );
    }

    public function create(string $name): void
    {
        $name = trim($name);

        if ($name === '') {
            throw new ValidationException('Category name required');
        }

        if ($this->categories->findByName($name)) {
            throw new ValidationException('Category already exists');
        }

        $this->categories->create($name);
    }

    public function update(int $id, string $name): void
    {
        $name = trim($name);

        if ($name === '') {
            throw new ValidationException('Category name required');
        }

        if (!$this->categories->findById($id)) {
            throw new NotFoundException('Category not found');
        }

        $this->categories->update($id, $name);
    }

    public function delete(int $id): void
    {
        if (!$this->categories->findById($id)) {
            throw new NotFoundException('Category not found');
        }

        // Fixes bug #6 for this specific case: a friendly 409 instead of
        // letting the FK constraint blow up as an unhandled PDOException.
        if ($this->categories->hasProducts($id)) {
            throw new ConflictException('Cannot delete a category that still has products');
        }

        $this->categories->delete($id);
    }
}
