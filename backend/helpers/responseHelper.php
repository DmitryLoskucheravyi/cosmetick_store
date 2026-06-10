<?php

class ResponseHelper
{
    public static function success($data = [], $message = "Success", $code = 200)
    {
        http_response_code($code);

        echo json_encode([
            "success" => true,
            "message" => $message,
            "data" => $data
        ]);

        exit();
    }

    public static function error($message = "Error", $code = 500)
    {
        http_response_code($code);

        echo json_encode([
            "success" => false,
            "message" => $message
        ]);

        exit();
    }
}