<?php

declare(strict_types=1);

namespace Vt241\Backend\Entities;

use Vt241\Backend\Enums\OrderStatus;

final class Order
{
    /** @param OrderItem[] $items */
    public function __construct(
        public readonly ?int $id,
        public readonly int $userId,
        public readonly float $totalPrice,
        public readonly OrderStatus $status,
        public readonly ?string $createdAt = null,
        public readonly array $items = [],
        public readonly ?string $customerName = null,
        public readonly ?string $customerEmail = null,
    ) {
    }

    public static function fromRow(array $row): self
    {
        return new self(
            id: (int) $row['id'],
            userId: (int) $row['userId'],
            totalPrice: (float) $row['totalPrice'],
            status: OrderStatus::from($row['status']),
            createdAt: $row['createdAt'] ?? null,
            customerName: $row['name'] ?? null,
            customerEmail: $row['email'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'userId' => $this->userId,
            'totalPrice' => $this->totalPrice,
            'status' => $this->status->value,
            'createdAt' => $this->createdAt,
            'name' => $this->customerName,
            'email' => $this->customerEmail,
            'items' => array_map(
                static fn (OrderItem $item) => $item->toArray(),
                $this->items
            ),
        ];
    }
}
