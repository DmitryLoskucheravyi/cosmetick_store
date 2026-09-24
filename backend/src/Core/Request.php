<?php

declare(strict_types=1);

namespace Vt241\Backend\Core;

final class Request
{
    private ?array $jsonCache = null;

    public function __construct(
        private readonly string $method,
        private readonly string $path,
        private readonly array $query,
        private readonly array $post,
        private readonly array $files,
        private readonly array $headers,
        private readonly string $rawBody
    ) {
    }

    public static function fromGlobals(): self
    {
        $path = (string) parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);

        $headers = function_exists('getallheaders') ? (getallheaders() ?: []) : [];
        $headers = array_change_key_case($headers, CASE_LOWER);

        return new self(
            strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET'),
            $path,
            $_GET,
            $_POST,
            $_FILES,
            $headers,
            (string) file_get_contents('php://input')
        );
    }

    public function method(): string
    {
        return $this->method;
    }

    public function path(): string
    {
        return $this->path;
    }

    public function query(string $key, mixed $default = null): mixed
    {
        return $this->query[$key] ?? $default;
    }

    public function post(string $key, mixed $default = null): mixed
    {
        return $this->post[$key] ?? $default;
    }

    public function file(string $key): ?array
    {
        if (!isset($this->files[$key]) || $this->files[$key]['error'] === UPLOAD_ERR_NO_FILE) {
            return null;
        }

        return $this->files[$key];
    }

    /** Decoded JSON body, or [] when the body is empty/not JSON. */
    public function json(): array
    {
        if ($this->jsonCache === null) {
            $decoded = json_decode($this->rawBody, true);
            $this->jsonCache = is_array($decoded) ? $decoded : [];
        }

        return $this->jsonCache;
    }

    /**
     * The token from "Authorization: Bearer <token>", matched
     * case-insensitively on both the header name and the scheme.
     */
    public function bearerToken(): ?string
    {
        $header = $this->headers['authorization'] ?? null;

        if (!$header || !preg_match('/^Bearer\s+(.+)$/i', $header, $matches)) {
            return null;
        }

        return trim($matches[1]);
    }
}
