<?php

declare(strict_types=1);

namespace Vt241\Backend\Core;

final class Response
{
    private function __construct(
        private readonly int $statusCode,
        private readonly array $payload
    ) {
    }

    public static function success(mixed $data = [], string $message = 'Success', int $code = 200): self
    {
        return new self($code, [
            'success' => true,
            'message' => $message,
            'data' => $data,
        ]);
    }

    public static function error(string $message = 'Error', int $code = 500): self
    {
        return new self($code, [
            'success' => false,
            'message' => $message,
        ]);
    }

    public function send(): void
    {
        http_response_code($this->statusCode);
        header('Content-Type: application/json');
        echo json_encode($this->payload, JSON_UNESCAPED_UNICODE);
    }
}
