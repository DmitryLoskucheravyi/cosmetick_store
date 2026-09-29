<?php

declare(strict_types=1);

namespace Vt241\Backend\Repositories;

use PDO;
use Vt241\Backend\Database\Database;
use Vt241\Backend\Entities\Order;
use Vt241\Backend\Entities\OrderItem;
use Vt241\Backend\Enums\OrderStatus;

final class OrderRepository implements OrderRepositoryInterface
{
    public function __construct(private readonly Database $database)
    {
    }

    public function create(int $userId, float $totalPrice, array $shipping): int
    {
        $stmt = $this->database->pdo()->prepare(
            'INSERT INTO orders
                (userId, totalPrice, shippingName, shippingPhone, shippingCity, shippingMethod, shippingAddress, paymentMethod, promoCode, discount, shippingCost)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $userId,
            $totalPrice,
            $shipping['name'],
            $shipping['phone'],
            $shipping['city'],
            $shipping['method'],
            $shipping['address'],
            $shipping['paymentMethod'],
            $shipping['promoCode'],
            $shipping['discount'],
            $shipping['shippingCost'],
        ]);

        return (int) $this->database->pdo()->lastInsertId();
    }

    public function addItem(int $orderId, int $productId, int $quantity, float $price): void
    {
        $stmt = $this->database->pdo()->prepare(
            'INSERT INTO order_items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)'
        );
        $stmt->execute([$orderId, $productId, $quantity, $price]);
    }

    public function findByIdForUser(int $id, int $userId): ?Order
    {
        $stmt = $this->database->pdo()->prepare('SELECT * FROM orders WHERE id = ? AND userId = ?');
        $stmt->execute([$id, $userId]);
        $row = $stmt->fetch();

        return $row ? Order::fromRow($row) : null;
    }

    public function findById(int $id): ?Order
    {
        $stmt = $this->database->pdo()->prepare('SELECT * FROM orders WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();

        return $row ? Order::fromRow($row) : null;
    }

    public function itemsForOrder(int $orderId): array
    {
        // Not filtered by isActive: a soft-deleted product must still show
        // its title/image in a historical order (fixes bug #3).
        $stmt = $this->database->pdo()->prepare(
            'SELECT oi.*, p.title, p.image
             FROM order_items oi
             INNER JOIN products p ON p.id = oi.productId
             WHERE oi.orderId = ?'
        );
        $stmt->execute([$orderId]);

        return array_map(
            static fn (array $row) => OrderItem::fromRow($row),
            $stmt->fetchAll()
        );
    }

    public function myOrders(int $userId): array
    {
        $stmt = $this->database->pdo()->prepare(
            'SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC'
        );
        $stmt->execute([$userId]);

        return array_map(
            static fn (array $row) => Order::fromRow($row),
            $stmt->fetchAll()
        );
    }

    public function allOrders(): array
    {
        $stmt = $this->database->pdo()->query(
            'SELECT o.*, u.name, u.email
             FROM orders o
             INNER JOIN users u ON u.id = o.userId
             ORDER BY o.createdAt DESC'
        );

        return array_map(
            static fn (array $row) => Order::fromRow($row),
            $stmt->fetchAll()
        );
    }

    public function updateStatus(int $id, OrderStatus $status): void
    {
        $stmt = $this->database->pdo()->prepare('UPDATE orders SET status = ? WHERE id = ?');
        $stmt->execute([$status->value, $id]);
    }

    public function countAll(): int
    {
        return (int) $this->database->pdo()->query('SELECT COUNT(*) FROM orders')->fetchColumn();
    }

    public function totalSales(): float
    {
        // Fixes the "дрібниця" item: cancelled orders no longer count as sales.
        $stmt = $this->database->pdo()->query(
            "SELECT COALESCE(SUM(totalPrice), 0) FROM orders WHERE status != 'cancelled'"
        );

        return (float) $stmt->fetchColumn();
    }

    public function latest(int $limit): array
    {
        $stmt = $this->database->pdo()->prepare(
            'SELECT o.id, o.totalPrice, o.status, o.createdAt, u.name, u.email
             FROM orders o
             INNER JOIN users u ON u.id = o.userId
             ORDER BY o.createdAt DESC
             LIMIT ?'
        );
        $stmt->bindValue(1, $limit, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll();
    }
}
