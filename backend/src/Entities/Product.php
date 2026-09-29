<?php

declare(strict_types=1);

namespace Vt241\Backend\Entities;

final class Product
{
    public function __construct(
        public readonly ?int $id,
        public readonly string $title,
        public readonly string $description,
        public readonly float $price,
        public readonly int $categoryId,
        public readonly ?string $image,
        public readonly int $stock,
        public readonly ?string $createdAt = null,
        public readonly ?string $categoryName = null,
        public readonly array $images = [],
        public readonly array $specs = [],
        public readonly float $avgRating = 0.0,
        public readonly int $reviewCount = 0,
    ) {
    }

    public static function fromRow(array $row): self
    {
        return new self(
            id: (int) $row['id'],
            title: (string) $row['title'],
            description: (string) $row['description'],
            price: (float) $row['price'],
            categoryId: (int) $row['categoryId'],
            image: $row['image'] ?? null,
            stock: (int) $row['stock'],
            createdAt: $row['createdAt'] ?? null,
            categoryName: $row['categoryName'] ?? null,
            images: self::decodeJsonArray($row['images'] ?? null),
            specs: self::decodeJsonArray($row['specs'] ?? null),
            avgRating: isset($row['avgRating']) ? round((float) $row['avgRating'], 1) : 0.0,
            reviewCount: isset($row['reviewCount']) ? (int) $row['reviewCount'] : 0,
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'price' => $this->price,
            'categoryId' => $this->categoryId,
            'image' => $this->image,
            'stock' => $this->stock,
            'createdAt' => $this->createdAt,
            'categoryName' => $this->categoryName,
            'images' => $this->images !== [] ? $this->images : array_filter([$this->image]),
            'specs' => $this->specs,
            'avgRating' => $this->avgRating,
            'reviewCount' => $this->reviewCount,
        ];
    }

    private static function decodeJsonArray(?string $json): array
    {
        if ($json === null || $json === '') {
            return [];
        }

        $decoded = json_decode($json, true);

        return is_array($decoded) ? $decoded : [];
    }
}
