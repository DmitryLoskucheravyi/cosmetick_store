<?php

declare(strict_types=1);

namespace Vt241\Backend\Repositories;

use Vt241\Backend\Entities\Review;

interface ReviewRepositoryInterface
{
    /** @return Review[] */
    public function listByProduct(int $productId): array;

    public function create(Review $review): int;

    /** @return array{average: float, count: int} */
    public function summaryFor(int $productId): array;
}
