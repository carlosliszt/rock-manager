<?php

class JWTMiddleware
{

    function getAuthorizationHeader()
    {
        $headers = null;
        if (isset($_SERVER['Authorization'])) {
            $headers = trim($_SERVER["Authorization"]);
        } elseif (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $headers = trim($_SERVER["HTTP_AUTHORIZATION"]);
        } elseif (function_exists('apache_request_headers')) {
            $requestHeaders = apache_request_headers();
            $requestHeaders = array_change_key_case($requestHeaders, CASE_LOWER);
            if (isset($requestHeaders['authorization'])) {
                $headers = trim($requestHeaders['authorization']);
            }
        }
        return $headers;
    }

    public function isValidToken(): stdClass
    {
        $token = $this->getAuthorizationHeader();
        if (!isset($token)) {
            (new Response(
                success: false,
                message: 'Token Inválido',
                error: [
                    'codigoError' => 'validation_error',
                    'message' => 'Não foi fornecido um token',
                ],
                httpCode: 401
            ))->send();
        }
        $Jwt = new JWTToken();
        if ($Jwt->validate(tokenStr: $token)) {
            return $Jwt->getPayload();
        } else {
            (new Response(
                success: false,
                message: 'Token Inválido',
                error: [
                    'codigoError' => 'validation_error',
                    'message' => 'O token fornecido não é válido',
                ],
                httpCode: 401
            ))->send();
        }
    }


}