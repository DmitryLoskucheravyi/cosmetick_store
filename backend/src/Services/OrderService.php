<?php

declare(strict_types=1);

namespace Vt241\Backend\Services;

use Throwable;
use Vt241\Backend\Database\Database;
use Vt241\Backend\Entities\Order;
use Vt241\Backend\Enums\OrderStatus;
use Vt241\Backend\Exceptions\NotFoundException;
use Vt241\Backend\Exceptions\ValidationException;
use Vt241\Backend\Repositories\CartRepositoryInterface;
use Vt241\Backend\Repositories\OrderRepositoryInterface;
use Vt241\Backend\Repositories\ProductRepositoryInterface;

final class OrderService
{
    private const FREE_SHIPPING_THRESHOLD = 1000.0;
    private const FLAT_SHIPPING_COST = 60.0;
    private const SHIPPING_METHODS = ['nova_poshta', 'ukrposhta', 'courier'];
    private const PAYMENT_METHODS = ['cod', 'card'];

    public function __construct(
        private readonly Database $database,
        private readonly OrderRepositoryInterface $orders,
        private readonly CartRepositoryInterface $cart,
        private readonly ProductRepositoryInterface $products,
        private readonly PromoService $promo
    ) {
    }

    /**
     * Fixes bug #2: the whole checkout now runs in one transaction and
     * stock is reserved with an atomic "stock >= quantity" update, so two
     * simultaneous orders can no longer oversell the same product.
     *
     * @param array{shippingName: string, shippingPhone: string, shippingCity: string, shippingMethod: string, shippingAddress: string, paymentMethod: string, promoCode: ?string} $shippingData
     */
    public function checkout(int $userId, array $shippingData): int
    {
        $this->validateShipping($shippingData);

        $items = $this->cart->checkoutItems($userId);

        if (empty($items)) {
            throw new ValidationException('Cart is empty');
        }

        $pdo = $this->database->pdo();
        $pdo->beginTransaction();

        try {
            $subtotal = 0.0;

            foreach ($items as $item) {
                $subtotal += (float) $item['price'] * (int) $item['quantity'];
            }

            $shippingCost = $subtotal >= self::FREE_SHIPPING_THRESHOLD ? 0.0 : self::FLAT_SHIPPING_COST;

            $discount = 0.0;
            $promoCode = null;

            if (!empty($shippingData['promoCode'])) {
                $promo = $this->promo->validate((string) $shippingData['promoCode'], $subtotal);
                $discount = $promo['discount'];
                $promoCode = $promo['code'];
            }

            $totalPrice = max(0.0, $subtotal + $shippingCost - $discount);

            $orderId = $this->orders->create($userId, $totalPrice, [
                'name' => $shippingData['shippingName'],
                'phone' => $shippingData['shippingPhone'],
                'city' => $shippingData['shippingCity'],
                'method' => $shippingData['shippingMethod'],
                'address' => $shippingData['shippingAddress'],
                'paymentMethod' => $shippingData['paymentMethod'],
                'promoCode' => $promoCode,
                'discount' => $discount,
                'shippingCost' => $shippingCost,
            ]);

            foreach ($items as $item) {
                $reserved = $this->products->decreaseStock(
                    (int) $item['productId'],
                    (int) $item['quantity']
                );

                if (!$reserved) {
                    throw new ValidationException("Not enough stock for \"{$item['title']}\"");
                }

                $this->orders->addItem(
                    $orderId,
                    (int) $item['productId'],
                    (int) $item['quantity'],
                    (float) $item['price']
                );
            }

            $this->cart->clear($userId);

            $pdo->commit();

            return $orderId;
        } catch (Throwable $e) {
            $pdo->rollBack();

            throw $e;
        }
    }

    public function myOrders(int $userId): array
    {
        return array_map(
            static fn (Order $order) => $order->toArray(),
            $this->orders->myOrders($userId)
        );
    }

    public function getOrder(int $id, int $userId): array
    {
        $order = $this->orders->findByIdForUser($id, $userId);

        if (!$order) {
            throw new NotFoundException('Order not found');
        }

        return $this->withItems($order)->toArray();
    }

    public function allOrders(): array
    {
        return array_map(
            static fn (Order $order) => $order->toArray(),
            $this->orders->allOrders()
        );
    }

    /**
     * Fixes bug #9: only a known status is accepted, and cancelling an
     * order returns its items' quantity back to stock.
     */
    public function updateStatus(int $orderId, string $status): void
    {
        if (!OrderStatus::isValid($status)) {
            throw new ValidationException('Invalid order status');
        }

        $order = $this->orders->findById($orderId);

        if (!$order) {
            throw new NotFoundException('Order not found');
        }

        $newStatus = OrderStatus::from($status);

        if ($newStatus === OrderStatus::Cancelled && $order->status !== OrderStatus::Cancelled) {
            foreach ($this->orders->itemsForOrder($orderId) as $item) {
                $this->products->increaseStock($item->productId, $item->quantity);
            }
        }

        $this->orders->updateStatus($orderId, $newStatus);
    }

    private function validateShipping(array $data): void
    {
        foreach (['shippingName', 'shippingPhone', 'shippingCity', 'shippingMethod', 'shippingAddress', 'paymentMethod'] as $field) {
            if (empty($data[$field])) {
                throw new ValidationException("Shipping field \"{$field}\" is required");
            }
        }

        if (!in_array($data['shippingMethod'], self::SHIPPING_METHODS, true)) {
            throw new ValidationException('Invalid shipping method');
        }

        if (!in_array($data['paymentMethod'], self::PAYMENT_METHODS, true)) {
            throw new ValidationException('Invalid payment method');
        }
    }

    private function withItems(Order $order): Order
    {
        return new Order(
            id: $order->id,
            userId: $order->userId,
            totalPrice: $order->totalPrice,
            status: $order->status,
            createdAt: $order->createdAt,
            items: $this->orders->itemsForOrder($order->id),
            customerName: $order->customerName,
            customerEmail: $order->customerEmail,
            shippingName: $order->shippingName,
            shippingPhone: $order->shippingPhone,
            shippingCity: $order->shippingCity,
            shippingMethod: $order->shippingMethod,
            shippingAddress: $order->shippingAddress,
            paymentMethod: $order->paymentMethod,
            promoCode: $order->promoCode,
            discount: $order->discount,
            shippingCost: $order->shippingCost,
        );
    }
}
