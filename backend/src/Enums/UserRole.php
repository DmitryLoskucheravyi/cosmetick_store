<?php

declare(strict_types=1);

namespace Vt241\Backend\Enums;

enum UserRole: string
{
    case User = 'user';
    case Admin = 'admin';
}
