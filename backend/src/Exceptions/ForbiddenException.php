<?php

declare(strict_types=1);

namespace Vt241\Backend\Exceptions;

final class ForbiddenException extends HttpException
{
    public function __construct(string $message = 'Admin access required')
    {
        parent::__construct($message, 403);
    }
}
