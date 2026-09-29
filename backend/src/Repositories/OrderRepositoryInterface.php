<?php

declare(strict_types=1);

namespace Vt241\Backend\Repositories;

use Vt241\Backend\Entities\Order;
use Vt241\Backend\Entities\OrderItem;
use Vt241\Backend\Enums\OrderStatus;

interface OrderRepositoryInterface
{
    /** @param array{name: string, phone: string, city: string, method: string, address: string, paymentMethod: string, promoCode: ?string, discount: float, shippingCost: float} $shipping */
    public function create(int $userId, float $totalPrice, array $shipping): int;

    public function addItem(int $orderId, int $productId, int $quantity, float $price): void;

    public function findByIdForUser(int $id, int $userId): ?Order;

    public function findById(int $id): ?Order;

    /** @return OrderItem[] */
    public function itemsForOrder(int $orderId): array;

    /** @return Order[] */
    public function myOrders(int $userId): array;

    /** @return Order[] */
    public function allOrders(): array;

    public function updateStatus(int $id, OrderStatus $status): void;

    public function countAll(): int;

    public function totalSales(): float;

    /** Latest orders joined with the customer's name/email, for the dashboard. */
    public function latest(int $limit): array;
}
