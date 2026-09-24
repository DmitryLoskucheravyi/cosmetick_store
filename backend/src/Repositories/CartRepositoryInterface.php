<?php

declare(strict_types=1);

namespace Vt241\Backend\Repositories;

use Vt241\Backend\Entities\CartItem;

interface CartRepositoryInterface
{
    /** Cart rows joined with product data, ready for the API response. */
    public function itemsForUser(int $userId): array;

    public function findEntry(int $userId, int $productId): ?CartItem;

    public function insert(int $userId, int $productId, int $quantity): void;

    public function incrementQuantity(int $entryId, int $delta): void;

    public function setQuantity(int $userId, int $productId, int $quantity): void;

    public function remove(int $userId, int $productId): void;

    public function clear(int $userId): void;

    /** Cart rows joined with price/stock, used to build an order. */
    public function checkoutItems(int $userId): array;
}
