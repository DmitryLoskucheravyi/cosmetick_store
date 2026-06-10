<?php

class UploadHelper
{
    public static function uploadProductImage($file)
    {
        if (!$file) {
            return null;
        }

        $uploadDir = __DIR__ . '/../uploads/products/';

        if (!file_exists($uploadDir)) {

            mkdir($uploadDir, 0777, true);
        }

        $extension = pathinfo(
            $file['name'],
            PATHINFO_EXTENSION
        );

        $fileName = uniqid() . '.' . $extension;

        $targetPath = $uploadDir . $fileName;

        move_uploaded_file(
            $file['tmp_name'],
            $targetPath
        );

        return '/uploads/products/' . $fileName;
    }

    public static function deleteImage($imagePath)
    {
        $fullPath = __DIR__ . '/../' . $imagePath;

        if (file_exists($fullPath)) {

            unlink($fullPath);
        }
    }
}