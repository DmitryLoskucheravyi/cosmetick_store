<?php

declare(strict_types=1);

namespace Vt241\Backend\Http\Controllers;

use Vt241\Backend\Core\Request;
use Vt241\Backend\Core\Response;
use Vt241\Backend\Services\PromoService;

final class PromoController
{
    public function __construct(private readonly PromoService $promo)
    {
    }

    public function validate(Request $request): Response
    {
        $body = $request->json();

        $result = $this->promo->validate(
            (string) ($body['code'] ?? ''),
            (float) ($body['subtotal'] ?? 0)
        );

        return Response::success($result, 'Promo code applied');
    }
}
