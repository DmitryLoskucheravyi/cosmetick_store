<?php

declare(strict_types=1);

namespace Vt241\Backend\Exceptions;

final class ConflictException extends HttpException
{
    public function __construct(string $message = 'Conflict')
    {
        parent::__construct($message, 409);
    }
}
