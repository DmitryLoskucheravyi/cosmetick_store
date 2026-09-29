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
        public readonly ?string $shippingName = null,
        public readonly ?string $shippingPhone = null,
        public readonly ?string $shippingCity = null,
        public readonly ?string $shippingMethod = null,
        public readonly ?string $shippingAddress = null,
        public readonly ?string $paymentMethod = null,
        public readonly ?string $promoCode = null,
        public readonly float $discount = 0.0,
        public readonly float $shippingCost = 0.0,
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
            shippingName: $row['shippingName'] ?? null,
            shippingPhone: $row['shippingPhone'] ?? null,
            shippingCity: $row['shippingCity'] ?? null,
            shippingMethod: $row['shippingMethod'] ?? null,
            shippingAddress: $row['shippingAddress'] ?? null,
            paymentMethod: $row['paymentMethod'] ?? null,
            promoCode: $row['promoCode'] ?? null,
            discount: isset($row['discount']) ? (float) $row['discount'] : 0.0,
            shippingCost: isset($row['shippingCost']) ? (float) $row['shippingCost'] : 0.0,
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
            'shippingName' => $this->shippingName,
            'shippingPhone' => $this->shippingPhone,
            'shippingCity' => $this->shippingCity,
            'shippingMethod' => $this->shippingMethod,
            'shippingAddress' => $this->shippingAddress,
            'paymentMethod' => $this->paymentMethod,
            'promoCode' => $this->promoCode,
            'discount' => $this->discount,
            'shippingCost' => $this->shippingCost,
            'subtotal' => round($this->totalPrice - $this->shippingCost + $this->discount, 2),
            'items' => array_map(
                static fn (OrderItem $item) => $item->toArray(),
                $this->items
            ),
        ];
    }
}
