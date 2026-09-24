<?php

declare(strict_types=1);

namespace Vt241\Backend\Repositories;

use Vt241\Backend\Entities\User;

interface UserRepositoryInterface
{
    public function findByEmail(string $email): ?User;

    public function findById(int $id): ?User;

    public function create(string $name, string $email, string $passwordHash): int;

    public function count(): int;
}
