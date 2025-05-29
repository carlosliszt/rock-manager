<?php

require_once "api/src/DAO/BandaDAO.php";
require_once "api/src/http/Response.php";

class BandaMiddleware
{
    public function stringJsonToStdClass($requestBody): \stdClass
    {
        $stdBanda = json_decode($requestBody);

        if (json_last_error() !== JSON_ERROR_NONE) {
            (new Response(
                success: false,
                message: 'Banda inválida',
                error: [
                    'code' => 'validation_error',
                    'message' => 'Json inválido',
                ],
                httpCode: 400
            ))->send();
            exit();
        } else if (!isset($stdBanda->banda)) {
            (new Response(
                success: false,
                message: 'Banda inválida',
                error: [
                    'code' => 'validation_error',
                    'message' => 'Não foi enviado o objeto Banda',
                ],
                httpCode: 400
            ))->send();
            exit();
        } else if (!isset($stdBanda->banda->nome)) {
            (new Response(
                success: false,
                message: 'Banda inválida',
                error: [
                    'code' => 'validation_error',
                    'message' => 'Não foi enviado o atributo nome da Banda',
                ],
                httpCode: 400
            ))->send();
            exit();
        }

        return $stdBanda;
    }

    public function isValidNome($nome): self
    {
        if (!isset($nome)) {
            (new Response(
                success: false,
                message: 'Nome da banda não enviado',
                error: [
                    'code' => 'validation_error',
                    'message' => 'O nome da banda não foi enviado'
                ],
                httpCode: 400
            ))->send();
            exit();
        } else if (strlen($nome) < 3) {
            (new Response(
                success: false,
                message: 'Nome da banda inválido',
                error: [
                    'code' => 'validation_error',
                    'message' => 'O nome da banda precisa de pelo menos 3 caracteres'
                ],
                httpCode: 400
            ))->send();
            exit();
        }
        return $this;
    }

    public function hasBandaByName($nome): self
    {
        $bandaDAO = new BandaDAO();
        $banda = $bandaDAO->readByName($nome);

        if (isset($banda)) {
            return $this;
        }

        (new Response(
            success: false,
            message: "Banda não cadastrada anteriormente",
            error: [
                'code' => 'validation_error',
                'message' => "Não existe banda com o nome ($nome)",
            ],
            httpCode: 400
        ))->send();
        exit();
    }

    public function hasNotBandaByName($nome): self
    {
        $bandaDAO = new BandaDAO();
        $banda = $bandaDAO->readByName($nome);

        if (!isset($banda)) {
            return $this;
        }

        (new Response(
            success: false,
            message: "Já existe uma banda cadastrada com o nome ($nome)",
            error: [
                'code' => 'validation_error',
                'message' => 'Banda já cadastrada anteriormente',
            ],
            httpCode: 400
        ))->send();
        exit();
    }

    public function hasBandaById($id): self
    {
        $bandaDAO = new BandaDAO();
        $banda = $bandaDAO->readById($id);
        if (!isset($banda)) {
            (new Response(
                success: false,
                message: "Não existe uma banda com o id fornecido",
                error: [
                    'code' => 'validation_error',
                    'message' => 'Banda informada não existente',
                ],
                httpCode: 400
            ))->send();
            exit();
        }
        return $this;
    }

    public function hasNotBandaById($id): self
    {
        $bandaDAO = new BandaDAO();
        $banda = $bandaDAO->readById($id);

        if ($banda !== null) {
            (new Response(
                success: false,
                message: "Já existe uma banda com o ID fornecido ($id)",
                error: [
                    'code' => 'validation_error',
                    'message' => 'ID de banda já está em uso',
                ],
                httpCode: 400
            ))->send();
            exit();
        }
        return $this;
    }

    public function isValidId($id): self
    {
        if (!isset($id)) {
            (new Response(
                success: false,
                message: 'ID da banda não foi enviado',
                error: [
                    'code' => 'banda_validation_error',
                    'message' => 'O id fornecido não é válido'
                ],
                httpCode: 400
            ))->send();
            exit();
        } else if (!is_numeric($id)) {
            (new Response(
                success: false,
                message: 'ID da banda não é um número',
                error: [
                    'code' => 'banda_validation_error',
                    'message' => 'O id fornecido não é um número'
                ],
                httpCode: 400
            ))->send();
            exit();
        } else if ($id <= 0) {
            (new Response(
                success: false,
                message: 'ID da banda não é positivo',
                error: [
                    'code' => 'banda_validation_error',
                    'message' => 'O id fornecido não é positivo'
                ],
                httpCode: 400
            ))->send();
            exit();
        }
        return $this;
    }

    public function isValidPage($page): self
    {
        if (!is_numeric($page)) {
            (new Response(
                success: false,
                message: 'A página fornecida não é um número',
                error: [
                    'code' => 'validation_error',
                    'message' => 'Página inválida',
                ],
                httpCode: 400
            ))->send();
            exit();
        } else if ($page <= 0) {
            (new Response(
                success: false,
                message: 'Identificação da página inválida',
                error: [
                    'code' => 'validation_error',
                    'message' => 'Página inválida',
                ],
                httpCode: 400
            ))->send();
            exit();
        }
        return $this;
    }

    public function isValidLimit($limit): self
    {
        if (!is_numeric($limit)) {
            (new Response(
                success: false,
                message: 'O limite fornecido não é um número',
                error: [
                    'code' => 'validation_error',
                    'message' => 'Limite inválido',
                ],
                httpCode: 400
            ))->send();
            exit();
        } else if ($limit <= 0) {
            (new Response(
                success: false,
                message: 'O limite não pode ser menor ou igual a zero',
                error: [
                    'code' => 'validation_error',
                    'message' => 'Limite inválido',
                ],
                httpCode: 400
            ))->send();
            exit();
        }
        return $this;
    }
}