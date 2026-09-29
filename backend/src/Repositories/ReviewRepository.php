<?php

declare(strict_types=1);

namespace Vt241\Backend\Repositories;

use Vt241\Backend\Database\Database;
use Vt241\Backend\Entities\Review;

final class ReviewRepository implements ReviewRepositoryInterface
{
    public function __construct(private readonly Database $database)
    {
    }

    public function listByProduct(int $productId): array
    {
        $stmt = $this->database->pdo()->prepare(
            'SELECT * FROM reviews WHERE productId = ? ORDER BY createdAt DESC'
        );
        $stmt->execute([$productId]);

        return array_map(
            static fn (array $row) => Review::fromRow($row),
            $stmt->fetchAll()
        );
    }

    public function create(Review $review): int
    {
        $stmt = $this->database->pdo()->prepare(
            'INSERT INTO reviews (productId, userId, authorName, rating, comment)
             VALUES (?, ?, ?, ?, ?)'
        );

        $stmt->execute([
            $review->productId,
            $review->userId,
            $review->authorName,
            $review->rating,
            $review->comment,
        ]);

        return (int) $this->database->pdo()->lastInsertId();
    }

    public function summaryFor(int $productId): array
    {
        $stmt = $this->database->pdo()->prepare(
            'SELECT AVG(rating) AS average, COUNT(*) AS count FROM reviews WHERE productId = ?'
        );
        $stmt->execute([$productId]);
        $row = $stmt->fetch();

        return [
            'average' => $row && $row['average'] !== null ? round((float) $row['average'], 1) : 0.0,
            'count' => $row ? (int) $row['count'] : 0,
        ];
    }
}
