<?php

declare(strict_types=1);

namespace Vt241\Backend\Entities;

use Vt241\Backend\Enums\UserRole;

final class User
{
    public function __construct(
        public readonly ?int $id,
        public readonly string $name,
        public readonly string $email,
        public readonly string $passwordHash,
        public readonly UserRole $role,
        public readonly ?string $createdAt = null,
    ) {
    }

    public static function fromRow(array $row): self
    {
        return new self(
            id: (int) $row['id'],
            name: (string) $row['name'],
            email: (string) $row['email'],
            passwordHash: (string) ($row['password'] ?? ''),
            role: UserRole::from($row['role'] ?? 'user'),
            createdAt: $row['createdAt'] ?? null,
        );
    }

    /** Never include passwordHash in an API response. */
    public function toPublicArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role->value,
            'createdAt' => $this->createdAt,
        ];
    }
}
