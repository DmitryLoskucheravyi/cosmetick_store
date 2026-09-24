<?php

declare(strict_types=1);

namespace Vt241\Backend\Entities;

final class OrderItem
{
    public function __construct(
        public readonly ?int $id,
        public readonly int $orderId,
        public readonly int $productId,
        public readonly int $quantity,
        public readonly float $price,
        public readonly ?string $title = null,
        public readonly ?string $image = null,
    ) {
    }

    public static function fromRow(array $row): self
    {
        return new self(
            id: (int) $row['id'],
            orderId: (int) $row['orderId'],
            productId: (int) $row['productId'],
            quantity: (int) $row['quantity'],
            price: (float) $row['price'],
            title: $row['title'] ?? null,
            image: $row['image'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'orderId' => $this->orderId,
            'productId' => $this->productId,
            'quantity' => $this->quantity,
            'price' => $this->price,
            'title' => $this->title,
            'image' => $this->image,
        ];
    }
}
