<?php

declare(strict_types=1);

namespace Vt241\Backend\Services;

use Vt241\Backend\Entities\Review;
use Vt241\Backend\Entities\User;
use Vt241\Backend\Exceptions\NotFoundException;
use Vt241\Backend\Exceptions\ValidationException;
use Vt241\Backend\Repositories\ProductRepositoryInterface;
use Vt241\Backend\Repositories\ReviewRepositoryInterface;

final class ReviewService
{
    public function __construct(
        private readonly ReviewRepositoryInterface $reviews,
        private readonly ProductRepositoryInterface $products
    ) {
    }

    public function list(int $productId): array
    {
        $this->assertProductExists($productId);

        return [
            'reviews' => array_map(
                static fn (Review $r) => $r->toArray(),
                $this->reviews->listByProduct($productId)
            ),
            'summary' => $this->reviews->summaryFor($productId),
        ];
    }

    /**
     * Anyone can leave a review, logged in or not (product decision: no
     * verified-purchase gate). A logged-in reviewer's name is used as-is;
     * a guest gets a stable-looking "User####" handle for that one review.
     */
    public function create(int $productId, ?User $user, array $data): array
    {
        $this->assertProductExists($productId);

        $rating = filter_var($data['rating'] ?? null, FILTER_VALIDATE_INT);
        $comment = trim((string) ($data['comment'] ?? ''));

        if ($rating === false || $rating < 1 || $rating > 5) {
            throw new ValidationException('Rating must be a whole number from 1 to 5');
        }

        if ($comment === '' || mb_strlen($comment) > 2000) {
            throw new ValidationException('Review text is required (max 2000 characters)');
        }

        $authorName = $user?->name ?? ('User' . random_int(1000, 9999));
        $createdAt = (new \DateTimeImmutable())->format('Y-m-d H:i:s');

        $id = $this->reviews->create(new Review(
            id: null,
            productId: $productId,
            userId: $user?->id,
            authorName: $authorName,
            rating: $rating,
            comment: $comment,
            createdAt: $createdAt,
        ));

        return [
            'id' => $id,
            'productId' => $productId,
            'authorName' => $authorName,
            'rating' => $rating,
            'comment' => $comment,
            'createdAt' => $createdAt,
        ];
    }

    private function assertProductExists(int $productId): void
    {
        if (!$this->products->findById($productId)) {
            throw new NotFoundException('Product not found');
        }
    }
}
