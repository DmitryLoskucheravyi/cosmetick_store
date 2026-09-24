<?php

declare(strict_types=1);

namespace Vt241\Backend\Repositories;

use Vt241\Backend\Database\Database;
use Vt241\Backend\Entities\Category;

final class CategoryRepository implements CategoryRepositoryInterface
{
    public function __construct(private readonly Database $database)
    {
    }

    public function all(): array
    {
        $stmt = $this->database->pdo()->query('SELECT * FROM categories ORDER BY name ASC');

        return array_map(
            static fn (array $row) => Category::fromRow($row),
            $stmt->fetchAll()
        );
    }

    public function findById(int $id): ?Category
    {
        $stmt = $this->database->pdo()->prepare('SELECT * FROM categories WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();

        return $row ? Category::fromRow($row) : null;
    }

    public function findByName(string $name): ?Category
    {
        $stmt = $this->database->pdo()->prepare('SELECT * FROM categories WHERE name = ?');
        $stmt->execute([$name]);
        $row = $stmt->fetch();

        return $row ? Category::fromRow($row) : null;
    }

    public function create(string $name): int
    {
        $stmt = $this->database->pdo()->prepare('INSERT INTO categories (name) VALUES (?)');
        $stmt->execute([$name]);

        return (int) $this->database->pdo()->lastInsertId();
    }

    public function update(int $id, string $name): void
    {
        $stmt = $this->database->pdo()->prepare('UPDATE categories SET name = ? WHERE id = ?');
        $stmt->execute([$name, $id]);
    }

    public function delete(int $id): void
    {
        $stmt = $this->database->pdo()->prepare('DELETE FROM categories WHERE id = ?');
        $stmt->execute([$id]);
    }

    public function hasProducts(int $id): bool
    {
        $stmt = $this->database->pdo()->prepare('SELECT 1 FROM products WHERE categoryId = ? LIMIT 1');
        $stmt->execute([$id]);

        return (bool) $stmt->fetchColumn();
    }

    public function count(): int
    {
        return (int) $this->database->pdo()->query('SELECT COUNT(*) FROM categories')->fetchColumn();
    }
}
