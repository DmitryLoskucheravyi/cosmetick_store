<?php

declare(strict_types=1);

namespace Vt241\Backend\Services;

use Vt241\Backend\Exceptions\ValidationException;

/**
 * Fixes bug #1: only real, size-checked images with a whitelisted
 * extension can be saved under uploads/products, so a renamed .php
 * file can no longer be uploaded and executed.
 */
final class ImageUploader
{
    private const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

    private const ALLOWED_MIME_TYPES = [
        'image/jpeg',
        'image/png',
        'image/webp',
    ];

    private readonly string $productsDir;

    public function __construct(private readonly string $backendRoot)
    {
        $this->productsDir = rtrim($this->backendRoot, '/\\') . '/uploads/products';

        if (!is_dir($this->productsDir)) {
            mkdir($this->productsDir, 0755, true);
        }
    }

    public function upload(?array $file): ?string
    {
        if (!$file || $file['error'] === UPLOAD_ERR_NO_FILE) {
            return null;
        }

        if ($file['error'] !== UPLOAD_ERR_OK) {
            throw new ValidationException('File upload failed');
        }

        $extension = strtolower(pathinfo((string) $file['name'], PATHINFO_EXTENSION));

        if (!in_array($extension, self::ALLOWED_EXTENSIONS, true)) {
            throw new ValidationException('Only jpg, jpeg, png and webp images are allowed');
        }

        // Reads the actual image header rather than trusting the client-sent
        // extension/MIME type — a .php file renamed to .jpg fails this check.
        $imageInfo = @getimagesize($file['tmp_name']);

        if ($imageInfo === false || !in_array($imageInfo['mime'], self::ALLOWED_MIME_TYPES, true)) {
            throw new ValidationException('Uploaded file is not a valid image');
        }

        $fileName = bin2hex(random_bytes(16)) . '.' . $extension;
        $targetPath = $this->productsDir . '/' . $fileName;

        if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
            throw new ValidationException('Could not save the uploaded file');
        }

        chmod($targetPath, 0644);

        return '/uploads/products/' . $fileName;
    }

    public function delete(?string $relativePath): void
    {
        if (!$relativePath || !preg_match('#^/uploads/products/[\w.\-]+$#', $relativePath)) {
            return;
        }

        $fullPath = rtrim($this->backendRoot, '/\\') . $relativePath;

        if (is_file($fullPath)) {
            unlink($fullPath);
        }
    }
}
