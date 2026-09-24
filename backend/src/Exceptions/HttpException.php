<?php

declare(strict_types=1);

namespace Vt241\Backend\Exceptions;

use RuntimeException;

class HttpException extends RuntimeException
{
    public function __construct(string $message, int $statusCode)
    {
        parent::__construct($message, $statusCode);
    }
}
