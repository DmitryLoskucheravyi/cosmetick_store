<?php

declare(strict_types=1);

namespace Vt241\Backend\Entities;

final class Review
{
    public function __construct(
        public readonly ?int $id,
        public readonly int $productId,
        public readonly ?int $userId,
        public readonly string $authorName,
        public readonly int $rating,
        public readonly string $comment,
        public readonly ?string $createdAt = null,
    ) {
    }

    public static function fromRow(array $row): self
    {
        return new self(
            id: (int) $row['id'],
            productId: (int) $row['productId'],
            userId: isset($row['userId']) ? (int) $row['userId'] : null,
            authorName: (string) $row['authorName'],
            rating: (int) $row['rating'],
            comment: (string) $row['comment'],
            createdAt: $row['createdAt'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'productId' => $this->productId,
            'authorName' => $this->authorName,
            'rating' => $this->rating,
            'comment' => $this->comment,
            'createdAt' => $this->createdAt,
        ];
    }
}
