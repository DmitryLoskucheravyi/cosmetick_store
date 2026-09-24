<?php

declare(strict_types=1);

namespace Vt241\Backend\Services;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use stdClass;
use Throwable;
use Vt241\Backend\Entities\User;

final class JwtService
{
    private const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 7;

    public function __construct(
        private readonly string $secret,
        private readonly int $ttlSeconds = self::DEFAULT_TTL_SECONDS
    ) {
    }

    public function issue(User $user): string
    {
        $payload = [
            'id' => $user->id,
            'email' => $user->email,
            'role' => $user->role->value,
            'iat' => time(),
            'exp' => time() + $this->ttlSeconds,
        ];

        return JWT::encode($payload, $this->secret, 'HS256');
    }

    public function verify(string $token): ?stdClass
    {
        try {
            return JWT::decode($token, new Key($this->secret, 'HS256'));
        } catch (Throwable) {
            return null;
        }
    }
}
