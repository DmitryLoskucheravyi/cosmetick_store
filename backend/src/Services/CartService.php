<?php

declare(strict_types=1);

namespace Vt241\Backend\Services;

use Vt241\Backend\Exceptions\NotFoundException;
use Vt241\Backend\Exceptions\ValidationException;
use Vt241\Backend\Repositories\CartRepositoryInterface;
use Vt241\Backend\Repositories\ProductRepositoryInterface;

final class CartService
{
    public function __construct(
        private readonly CartRepositoryInterface $cart,
        private readonly ProductRepositoryInterface $products
    ) {
    }

    public function get(int $userId): array
    {
        return $this->cart->itemsForUser($userId);
    }

    public function add(int $userId, mixed $productId): void
    {
        // Fixes bug #8: the product must exist and be in stock before it
        // can be added to the cart.
        $productId = $this->toPositiveInt($productId, 'Product id required');
        $product = $this->products->findById($productId);

        if (!$product) {
            throw new NotFoundException('Product not found');
        }

        if ($product->stock < 1) {
            throw new ValidationException('Product is out of stock');
        }

        $entry = $this->cart->findEntry($userId, $productId);

        if ($entry) {
            $this->cart->incrementQuantity((int) $entry->id, 1);
        } else {
            $this->cart->insert($userId, $productId, 1);
        }
    }

    public function updateQuantity(int $userId, mixed $productId, mixed $quantity): void
    {
        // Fixes bug #8: quantity is now a real positive integer, capped at stock.
        $productId = $this->toPositiveInt($productId, 'Product id required');
        $quantity = $this->toPositiveInt($quantity, 'Quantity must be a positive number');

        $product = $this->products->findById($productId);

        if (!$product) {
            throw new NotFoundException('Product not found');
        }

        if ($quantity > $product->stock) {
            throw new ValidationException('Not enough stock available');
        }

        $this->cart->setQuantity($userId, $productId, $quantity);
    }

    public function remove(int $userId, mixed $productId): void
    {
        $this->cart->remove($userId, $this->toPositiveInt($productId, 'Product id required'));
    }

    public function clear(int $userId): void
    {
        $this->cart->clear($userId);
    }

    private function toPositiveInt(mixed $value, string $errorMessage): int
    {
        if (!is_numeric($value) || (int) $value < 1) {
            throw new ValidationException($errorMessage);
        }

        return (int) $value;
    }
}
