<?php

declare(strict_types=1);

namespace Vt241\Backend\Services;

use Vt241\Backend\Entities\User;
use Vt241\Backend\Enums\UserRole;
use Vt241\Backend\Exceptions\NotFoundException;
use Vt241\Backend\Exceptions\UnauthorizedException;
use Vt241\Backend\Exceptions\ValidationException;
use Vt241\Backend\Repositories\UserRepositoryInterface;

final class AuthService
{
    private const MIN_PASSWORD_LENGTH = 8;

    public function __construct(
        private readonly UserRepositoryInterface $users,
        private readonly JwtService $jwt
    ) {
    }

    public function register(string $name, string $email, string $password): array
    {
        $name = trim($name);
        $email = trim($email);

        // Fixes bug #14: the password itself is never trim()'d, and a
        // minimum length is now enforced.
        if ($name === '' || $email === '' || $password === '') {
            throw new ValidationException('All fields are required');
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new ValidationException('Invalid email');
        }

        if (strlen($password) < self::MIN_PASSWORD_LENGTH) {
            throw new ValidationException('Password must be at least 8 characters long');
        }

        if ($this->users->findByEmail($email) !== null) {
            throw new ValidationException('Email already exists');
        }

        $userId = $this->users->create($name, $email, password_hash($password, PASSWORD_DEFAULT));

        $user = new User($userId, $name, $email, '', UserRole::User);

        return [
            'user' => $user->toPublicArray(),
            'token' => $this->jwt->issue($user),
        ];
    }

    public function login(string $email, string $password): array
    {
        $email = trim($email);

        if ($email === '' || $password === '') {
            throw new ValidationException('Email and password required');
        }

        $user = $this->users->findByEmail($email);

        if (!$user || !password_verify($password, $user->passwordHash)) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return [
            'user' => $user->toPublicArray(),
            'token' => $this->jwt->issue($user),
        ];
    }

    public function currentUser(int $id): array
    {
        $user = $this->users->findById($id);

        if (!$user) {
            throw new NotFoundException('User not found');
        }

        return $user->toPublicArray();
    }
}
