<?php

declare(strict_types=1);

namespace Vt241\Backend\Exceptions;

final class UnauthorizedException extends HttpException
{
    public function __construct(string $message = 'Access denied')
    {
        parent::__construct($message, 401);
    }
}
