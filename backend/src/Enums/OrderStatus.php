<?php

declare(strict_types=1);

namespace Vt241\Backend\Enums;

/** Fixes bug #9 — order status is now a closed set instead of any string. */
enum OrderStatus: string
{
    case Pending = 'pending';
    case Processing = 'processing';
    case Shipped = 'shipped';
    case Delivered = 'delivered';
    case Cancelled = 'cancelled';

    public static function isValid(string $value): bool
    {
        return self::tryFrom($value) !== null;
    }
}
