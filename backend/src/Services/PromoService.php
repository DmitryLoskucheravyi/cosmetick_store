<?php

declare(strict_types=1);

namespace Vt241\Backend\Services;

use Vt241\Backend\Exceptions\ValidationException;

/**
 * MVP promo codes: a static allowlist rather than a `promo_codes` table.
 * Swap this for a repository-backed lookup if codes need to be managed
 * from the admin panel later.
 */
final class PromoService
{
    private const CODES = [
        'WELCOME10' => 0.10,
        'BEAUTY15' => 0.15,
    ];

    /** @return array{code: string, percent: float, discount: float} */
    public function validate(string $code, float $subtotal): array
    {
        $normalized = strtoupper(trim($code));

        if ($normalized === '' || !isset(self::CODES[$normalized])) {
            throw new ValidationException('Invalid promo code');
        }

        $percent = self::CODES[$normalized];

        return [
            'code' => $normalized,
            'percent' => $percent,
            'discount' => round($subtotal * $percent, 2),
        ];
    }
}
