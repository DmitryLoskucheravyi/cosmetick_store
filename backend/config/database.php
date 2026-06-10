<?php

require_once __DIR__ . '/../vendor/autoload.php';

class Database
{
    private static $connection = null;

    public static function connect()
    {
        if (self::$connection === null) {

            $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
            $dotenv->load();

            $host = $_ENV['DB_HOST'];
            $port = $_ENV['DB_PORT'];
            $dbName = $_ENV['DB_NAME'];
            $username = $_ENV['DB_USER'];
            $password = $_ENV['DB_PASSWORD'];

            try {

                self::$connection = new PDO(
                    "mysql:host=$host;port=$port;dbname=$dbName;charset=utf8mb4",
                    $username,
                    $password
                );

                self::$connection->setAttribute(
                    PDO::ATTR_ERRMODE,
                    PDO::ERRMODE_EXCEPTION
                );

            } catch (PDOException $e) {

                die("Database connection failed: " . $e->getMessage());
            }
        }

        return self::$connection;
    }
}