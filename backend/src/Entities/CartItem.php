<?php

declare(strict_types=1);

namespace Vt241\Backend\Entities;

final class CartItem
{
    public function __construct(
        public readonly ?int $id,
        public readonly int $userId,
        public readonly int $productId,
        public readonly int $quantity,
    ) {
    }

    public static function fromRow(array $row): self
    {
        return new self(
            id: (int) $row['id'],
            userId: (int) $row['userId'],
            productId: (int) $row['productId'],
            quantity: (int) $row['quantity'],
        );
    }
}
