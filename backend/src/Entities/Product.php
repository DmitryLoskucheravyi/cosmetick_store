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
        ];
    }
}
