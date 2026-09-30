<?php

declare(strict_types=1);

namespace Vt241\Backend\Database;

use PDO;
use PDOException;
use RuntimeException;

/**
 * Thin wrapper around a single PDO connection. Created once in
 * Bootstrap and passed into repositories via the constructor —
 * no static singleton, no reading of .env here (fixes the ООП
 * item "Database сам читає .env").
 */
final class Database
{
    private PDO $pdo;

    public function __construct(
        string $host,
        string $port,
        string $name,
        string $username,
        #[\SensitiveParameter] string $password
    ) {
        try {
            $this->pdo = new PDO(
                "mysql:host={$host};port={$port};dbname={$name};charset=utf8mb4",
                $username,
                $password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                ]
            );
        } catch (PDOException $e) {
            // Fixes bug #7: no die(), no host/user leaked to the client.
            error_log('[DB CONNECTION ERROR] ' . $e->getMessage());

            throw new RuntimeException('Database unavailable', 500, $e);
        }
    }

    public function pdo(): PDO
    {
        return $this->pdo;
    }
}
