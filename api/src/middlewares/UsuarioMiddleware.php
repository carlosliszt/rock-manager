<?php

require_once 'api/src/DAO/UsuarioDAO.php';
require_once 'api/src/http/Response.php';

class UsuarioMiddleware
{
    public function stringJsonToStdClass($requestBody): \stdClass
    {
        $stdUsuario = json_decode($requestBody);

        if (json_last_error() !== JSON_ERROR_NONE) {
            (new Response(
                success: false,
                message: 'Usuário inválido',
                error: [
                    'code' => 'validation_error',
                    'message' => 'Json inválido',
                ],
                httpCode: 400
            ))->send();
            exit();
        } else if (!isset($stdUsuario->usuario)) {
            (new Response(
                success: false,
                message: 'Usuário inválido',
                error: [
                    'code' => 'validation_error',
                    'message' => 'Não foi enviado o objeto Usuario',
                ],
                httpCode: 400
            ))->send();
            exit();
        } else if (!isset($stdUsuario->usuario->username)) {
            (new Response(
                success: false,
                message: 'Usuário inválido',
                error: [
                    'code' => 'validation_error',
                    'message' => 'Não foi enviado o atributo username do Usuário',
                ],
                httpCode: 400
            ))->send();
            exit();
        } else if (!isset($stdUsuario->usuario->email)) {
            (new Response(
                success: false,
                message: 'Usuário inválido',
                error: [
                    'code' => 'validation_error',
                    'message' => 'Não foi enviado o atributo email do Usuário',
                ],
                httpCode: 400
            ))->send();
            exit();
        } else if (!isset($stdUsuario->usuario->senha)) {
            (new Response(
                success: false,
                message: 'Usuário inválido',
                error: [
                    'code' => 'validation_error',
                    'message' => 'Não foi enviado o atributo senha do Usuário',
                ],
                httpCode: 400
            ))->send();
            exit();
        }

        return $stdUsuario;
    }

    public function isValidUsername($username): self
    {
        if (!isset($username) || strlen($username) < 3) {
            (new Response(
                success: false,
                message: 'Username inválido',
                error: [
                    'code' => 'validation_error',
                    'message' => 'O username precisa de pelo menos 3 caracteres'
                ],
                httpCode: 400
            ))->send();
        }
        return $this;
    }

    public function isValidEmail($email): self
    {
        if (!isset($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            (new Response(
                success: false,
                message: 'Email inválido',
                error: [
                    'code' => 'validation_error',
                    'message' => 'O email fornecido não é válido'
                ],
                httpCode: 400
            ))->send();
            exit();
        }
        return $this;
    }

    public function isValidSenha($senha): self
    {
        if (!isset($senha) || strlen($senha) < 6) {
            (new Response(
                success: false,
                message: 'Senha inválida',
                error: [
                    'code' => 'validation_error',
                    'message' => 'A senha precisa de pelo menos 6 caracteres'
                ],
                httpCode: 400
            ))->send();
            exit();
        }
        return $this;
    }

    public function hasNotUsuarioByEmail($email): self
    {
        $usuarioDAO = new UsuarioDAO();
        $usuario = $usuarioDAO->readByEmail($email);

        if (!isset($usuario)) {
            return $this;
        }

        (new Response(
            success: false,
            message: "Já existe um usuário cadastrado com o email ($email)",
            error: [
                'code' => 'validation_error',
                'message' => 'Email já cadastrado anteriormente',
            ],
            httpCode: 400
        ))->send();
    }

    public function hasNotUsername($username): self
    {
        $usuarioDAO = new UsuarioDAO();
        $usuario = $usuarioDAO->readByUsername($username);

        if (!isset($usuario)) {
            return $this;
        }

        (new Response(
            success: false,
            message: "Já existe um usuário cadastrado com o username ($username)",
            error: [
                'code' => 'validation_error',
                'message' => 'Nome de usuário já cadastrado anteriormente',
            ],
            httpCode: 400
        ))->send();
    }

}