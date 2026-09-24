<?php

declare(strict_types=1);

namespace Vt241\Backend\Repositories;

use PDO;
use Vt241\Backend\Database\Database;
use Vt241\Backend\Entities\Product;

final class ProductRepository implements ProductRepositoryInterface
{
    public function __construct(private readonly Database $database)
    {
    }

    public function paginate(array $filters, int $limit, int $offset): array
    {
        [$where, $params] = $this->buildWhere($filters);

        $countStmt = $this->database->pdo()->prepare(
            "SELECT COUNT(*) FROM products p INNER JOIN categories c ON c.id = p.categoryId {$where}"
        );
        $countStmt->execute($params);
        $total = (int) $countStmt->fetchColumn();

        $orderBy = $this->orderByClause((string) ($filters['sort'] ?? 'newest'));

        $stmt = $this->database->pdo()->prepare(
            "SELECT p.*, c.name AS categoryName
             FROM products p
             INNER JOIN categories c ON c.id = p.categoryId
             {$where}
             {$orderBy}
             LIMIT :limit OFFSET :offset"
        );

        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }

        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        $items = array_map(
            static fn (array $row) => Product::fromRow($row),
            $stmt->fetchAll()
        );

        return ['items' => $items, 'total' => $total];
    }

    public function findById(int $id): ?Product
    {
        $stmt = $this->database->pdo()->prepare(
            'SELECT p.*, c.name AS categoryName
             FROM products p
             INNER JOIN categories c ON c.id = p.categoryId
             WHERE p.id = ? AND p.isActive = 1'
        );
        $stmt->execute([$id]);
        $row = $stmt->fetch();

        return $row ? Product::fromRow($row) : null;
    }

    public function create(Product $product): int
    {
        $stmt = $this->database->pdo()->prepare(
            'INSERT INTO products (title, description, price, categoryId, image, stock)
             VALUES (?, ?, ?, ?, ?, ?)'
        );

        $stmt->execute([
            $product->title,
            $product->description,
            $product->price,
            $product->categoryId,
            $product->image,
            $product->stock,
        ]);

        return (int) $this->database->pdo()->lastInsertId();
    }

    public function update(int $id, Product $product): void
    {
        $stmt = $this->database->pdo()->prepare(
            'UPDATE products
             SET title = ?, description = ?, price = ?, categoryId = ?, image = ?, stock = ?
             WHERE id = ?'
        );

        $stmt->execute([
            $product->title,
            $product->description,
            $product->price,
            $product->categoryId,
            $product->image,
            $product->stock,
            $id,
        ]);
    }

    public function delete(int $id): void
    {
        $stmt = $this->database->pdo()->prepare('UPDATE products SET isActive = 0 WHERE id = ?');
        $stmt->execute([$id]);
    }

    public function decreaseStock(int $id, int $quantity): bool
    {
        $stmt = $this->database->pdo()->prepare(
            'UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?'
        );
        $stmt->execute([$quantity, $id, $quantity]);

        return $stmt->rowCount() === 1;
    }

    public function increaseStock(int $id, int $quantity): void
    {
        $stmt = $this->database->pdo()->prepare('UPDATE products SET stock = stock + ? WHERE id = ?');
        $stmt->execute([$quantity, $id]);
    }

    public function count(): int
    {
        return (int) $this->database->pdo()
            ->query('SELECT COUNT(*) FROM products WHERE isActive = 1')
            ->fetchColumn();
    }

    /** @return array{0: string, 1: array<string, mixed>} */
    private function buildWhere(array $filters): array
    {
        $conditions = ['p.isActive = 1'];
        $params = [];

        if (!empty($filters['search'])) {
            $conditions[] = 'p.title LIKE :search';
            $params[':search'] = '%' . $filters['search'] . '%';
        }

        if (!empty($filters['category'])) {
            $conditions[] = 'p.categoryId = :category';
            $params[':category'] = $filters['category'];
        }

        if (isset($filters['minPrice']) && $filters['minPrice'] !== '') {
            $conditions[] = 'p.price >= :minPrice';
            $params[':minPrice'] = $filters['minPrice'];
        }

        if (isset($filters['maxPrice']) && $filters['maxPrice'] !== '') {
            $conditions[] = 'p.price <= :maxPrice';
            $params[':maxPrice'] = $filters['maxPrice'];
        }

        $stock = $filters['stock'] ?? '';

        if ($stock === 'in-stock') {
            $conditions[] = 'p.stock > 0';
        } elseif ($stock === 'out-of-stock') {
            $conditions[] = 'p.stock = 0';
        } elseif ($stock === 'low-stock') {
            $conditions[] = 'p.stock BETWEEN 1 AND 5';
        }

        return ['WHERE ' . implode(' AND ', $conditions), $params];
    }

    private function orderByClause(string $sort): string
    {
        return match ($sort) {
            'price-asc' => 'ORDER BY p.price ASC',
            'price-desc' => 'ORDER BY p.price DESC',
            'name-asc' => 'ORDER BY p.title ASC',
            'name-desc' => 'ORDER BY p.title DESC',
            default => 'ORDER BY p.createdAt DESC',
        };
    }
}
