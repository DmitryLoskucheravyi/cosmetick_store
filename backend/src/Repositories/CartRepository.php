<?php

declare(strict_types=1);

namespace Vt241\Backend\Repositories;

use Vt241\Backend\Database\Database;
use Vt241\Backend\Entities\CartItem;

final class CartRepository implements CartRepositoryInterface
{
    public function __construct(private readonly Database $database)
    {
    }

    public function itemsForUser(int $userId): array
    {
        $stmt = $this->database->pdo()->prepare(
            'SELECT
                c.id,
                c.quantity,
                p.id AS productId,
                p.title,
                p.price,
                p.image,
                (p.price * c.quantity) AS total
             FROM cart c
             INNER JOIN products p ON p.id = c.productId
             WHERE c.userId = ?'
        );
        $stmt->execute([$userId]);

        return $stmt->fetchAll();
    }

    public function findEntry(int $userId, int $productId): ?CartItem
    {
        $stmt = $this->database->pdo()->prepare(
            'SELECT * FROM cart WHERE userId = ? AND productId = ?'
        );
        $stmt->execute([$userId, $productId]);
        $row = $stmt->fetch();

        return $row ? CartItem::fromRow($row) : null;
    }

    public function insert(int $userId, int $productId, int $quantity): void
    {
        $stmt = $this->database->pdo()->prepare(
            'INSERT INTO cart (userId, productId, quantity) VALUES (?, ?, ?)'
        );
        $stmt->execute([$userId, $productId, $quantity]);
    }

    public function incrementQuantity(int $entryId, int $delta): void
    {
        $stmt = $this->database->pdo()->prepare('UPDATE cart SET quantity = quantity + ? WHERE id = ?');
        $stmt->execute([$delta, $entryId]);
    }

    public function setQuantity(int $userId, int $productId, int $quantity): void
    {
        $stmt = $this->database->pdo()->prepare(
            'UPDATE cart SET quantity = ? WHERE userId = ? AND productId = ?'
        );
        $stmt->execute([$quantity, $userId, $productId]);
    }

    public function remove(int $userId, int $productId): void
    {
        $stmt = $this->database->pdo()->prepare('DELETE FROM cart WHERE userId = ? AND productId = ?');
        $stmt->execute([$userId, $productId]);
    }

    public function clear(int $userId): void
    {
        $stmt = $this->database->pdo()->prepare('DELETE FROM cart WHERE userId = ?');
        $stmt->execute([$userId]);
    }

    public function checkoutItems(int $userId): array
    {
        $stmt = $this->database->pdo()->prepare(
            'SELECT
                c.productId,
                c.quantity,
                p.title,
                p.price,
                p.stock
             FROM cart c
             INNER JOIN products p ON p.id = c.productId
             WHERE c.userId = ?'
        );
        $stmt->execute([$userId]);

        return $stmt->fetchAll();
    }
}
