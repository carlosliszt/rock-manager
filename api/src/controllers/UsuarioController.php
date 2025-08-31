<?php

require_once "api/src/DAO/UsuarioDAO.php";
require_once "api/src/http/Response.php";
require_once "api/src/utils/JWTToken.php";

class UsuarioController
{
    private UsuarioDAO $usuarioDAO;

    public function __construct()
    {
        $this->usuarioDAO = new UsuarioDAO();
    }

    public function login(stdClass $dados): never
    {
        if (!isset($dados->email, $dados->senha)) {
            (new Response(
                success: false,
                message: 'Email e senha são obrigatórios.',
                httpCode: 400
            ))->send();
        }

        $usuario = $this->usuarioDAO->login($dados->email, $dados->senha);

        if ($usuario) {
            if($usuario->getAtivo() == 1) {
                $resposta = $usuario->jsonSerialize();
                unset($resposta['password_hash']);

                $claims = new stdClass();
                $claims->payload = new stdClass();
                $claims->payload->public = (object)[
                    'id' => $usuario->getId(),
                    'username' => $usuario->getUsername(),
                    'role' => $usuario->getRole()
                ];
                $claims->payload->private = (object)[
                    'email' => $usuario->getEmail(),
                ];

                $jwt = new JWTToken();
                $token = $jwt->generateToken($claims);

                (new Response(
                    success: true,
                    message: 'Login realizado com sucesso.',
                    data: [
                        'usuario' => $resposta,
                        'token' => $token
                    ],
                    httpCode: 200
                ))->send();
            } else {
                (new Response(
                    success: false,
                    message: 'Usuário inativo. Contate o administrador.',
                    httpCode: 403
                ))->send();
            }
        } else {
            (new Response(
                success: false,
                message: 'Credenciais inválidas.',
                httpCode: 401
            ))->send();
        }
    }

    public function register(\stdClass $dados): never
    {
        if (!isset($dados->usuario->username, $dados->usuario->email, $dados->usuario->senha)) {
            (new Response(
                success: false,
                message: 'Username, email e senha são obrigatórios.',
                httpCode: 400
            ))->send();
        }

        $username = $dados->usuario->username;
        $email = $dados->usuario->email;
        $senha = $dados->usuario->senha;

        $senhaHash = password_hash($senha, PASSWORD_DEFAULT);

        $usuario = new Usuario(
            0,
            $username,
            $email,
            $senhaHash,
            'user',
            true,
            date('Y-m-d H:i:s')
        );

        $id = $this->usuarioDAO->create($usuario);

        if ($id) {
            (new Response(
                success: true,
                message: 'Usuário registrado com sucesso.',
                data: ['id' => $id],
                httpCode: 201
            ))->send();
        } else {
            (new Response(
                success: false,
                message: 'Erro ao registrar usuário.',
                httpCode: 500
            ))->send();
        }
    }

    function index(): never
    {
        $usuarios = $this->usuarioDAO->readAll();

        if (empty($usuarios)) {
            (new Response(
                success: false,
                message: 'Nenhum usuário encontrado.',
                httpCode: 404
            ))->send();
        } else {
            $data = array_map(fn($usuario) => $usuario->jsonSerialize(), $usuarios);
            (new Response(
                success: true,
                message: 'Usuários encontrados.',
                data: ['usuarios' => $data],
                httpCode: 200
            ))->send();
        }
    }

}