<?php

declare(strict_types=1);

namespace Vt241\Backend\Repositories;

use Vt241\Backend\Database\Database;
use Vt241\Backend\Entities\User;

final class UserRepository implements UserRepositoryInterface
{
    public function __construct(private readonly Database $database)
    {
    }

    public function findByEmail(string $email): ?User
    {
        $stmt = $this->database->pdo()->prepare('SELECT * FROM users WHERE email = ?');
        $stmt->execute([$email]);
        $row = $stmt->fetch();

        return $row ? User::fromRow($row) : null;
    }

    public function findById(int $id): ?User
    {
        // Always re-read the role from the DB (fixes bug #13: a revoked
        // admin loses access immediately instead of waiting out the JWT).
        $stmt = $this->database->pdo()->prepare(
            'SELECT id, name, email, role, createdAt FROM users WHERE id = ?'
        );
        $stmt->execute([$id]);
        $row = $stmt->fetch();

        return $row ? User::fromRow($row) : null;
    }

    public function create(string $name, string $email, string $passwordHash): int
    {
        $stmt = $this->database->pdo()->prepare(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')"
        );
        $stmt->execute([$name, $email, $passwordHash]);

        return (int) $this->database->pdo()->lastInsertId();
    }

    public function count(): int
    {
        return (int) $this->database->pdo()->query('SELECT COUNT(*) FROM users')->fetchColumn();
    }
}
