<?php

require_once "api/src/DAO/ShowDAO.php";
require_once "api/src/http/Response.php";

class ShowMiddleware
{
    public function stringJsonToStdClass($requestBody): \stdClass
    {
        $stdShow = json_decode($requestBody);

        if (json_last_error() !== JSON_ERROR_NONE) {
            (new Response(
                success: false,
                message: 'Show inválido',
                error: [
                    'code' => 'validation_error',
                    'message' => 'Json inválido',
                ],
                httpCode: 400
            ))->send();
            exit();
        } else if (!isset($stdShow->show)) {
            (new Response(
                success: false,
                message: 'Show inválido',
                error: [
                    'code' => 'validation_error',
                    'message' => 'Não foi enviado o objeto Show',
                ],
                httpCode: 400
            ))->send();
            exit();
        } else if (!isset($stdShow->show->local) || !isset($stdShow->show->data)) {
            (new Response(
                success: false,
                message: 'Show inválido',
                error: [
                    'code' => 'validation_error',
                    'message' => 'Atributos obrigatórios (local, data) não enviados',
                ],
                httpCode: 400
            ))->send();
            exit();
        }

        return $stdShow;
    }

    public function isValidLocal($local): self
    {
        if (!isset($local) || strlen($local) < 3) {
            (new Response(
                success: false,
                message: 'Local do show inválido',
                error: [
                    'code' => 'validation_error',
                    'message' => 'O local do show deve ter pelo menos 3 caracteres'
                ],
                httpCode: 400
            ))->send();
            exit();
        }
        return $this;
    }

    public function isValidData($data): self
    {
        if (!isset($data) || !preg_match('/^\d{4}-\d{2}-\d{2}/', $data)) {
            (new Response(
                success: false,
                message: 'Data do show inválida',
                error: [
                    'code' => 'validation_error',
                    'message' => 'A data deve estar no formato YYYY-MM-DD'
                ],
                httpCode: 400
            ))->send();
            exit();
        }
        return $this;
    }

    public function hasNotShowByLocalData($local, $data): self
    {
        $showDAO = new ShowDAO();
        $show = $showDAO->readByLocalData($local, $data);

        if ($show !== null) {
            (new \Response(
                success: false,
                message: "Já existe um show cadastrado neste local e data",
                error: [
                    'code' => 'validation_error',
                    'message' => 'Show duplicado para o mesmo local e data',
                ],
                httpCode: 400
            ))->send();
            exit();
        }
        return $this;
    }

    public function hasShowById($id): self
    {
        $showDAO = new ShowDAO();
        $show = $showDAO->readById($id);
        if (!isset($show)) {
            (new Response(
                success: false,
                message: "Não existe um show com o id fornecido",
                error: [
                    'code' => 'validation_error',
                    'message' => 'Show informado não existente',
                ],
                httpCode: 400
            ))->send();
            exit();
        }
        return $this;
    }

    public function hasNotShowById($id): self
    {
        $showDAO = new ShowDAO();
        $show = $showDAO->readById($id);

        if ($show !== null) {
            (new Response(
                success: false,
                message: "Já existe um show com o ID fornecido ($id)",
                error: [
                    'code' => 'validation_error',
                    'message' => 'ID de show já está em uso',
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
                message: 'ID do show não foi enviado',
                error: [
                    'code' => 'show_validation_error',
                    'message' => 'O id fornecido não é válido'
                ],
                httpCode: 400
            ))->send();
            exit();
        } else if (!is_numeric($id)) {
            (new Response(
                success: false,
                message: 'ID do show não é um número',
                error: [
                    'code' => 'show_validation_error',
                    'message' => 'O id fornecido não é um número'
                ],
                httpCode: 400
            ))->send();
            exit();
        } else if ($id <= 0) {
            (new Response(
                success: false,
                message: 'ID do show não é positivo',
                error: [
                    'code' => 'show_validation_error',
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
        if (!is_numeric($page) || $page <= 0) {
            (new Response(
                success: false,
                message: 'Página inválida',
                error: [
                    'code' => 'validation_error',
                    'message' => 'Página deve ser um número positivo',
                ],
                httpCode: 400
            ))->send();
            exit();
        }
        return $this;
    }

    public function isValidLimit($limit): self
    {
        if (!is_numeric($limit) || $limit <= 0) {
            (new Response(
                success: false,
                message: 'Limite inválido',
                error: [
                    'code' => 'validation_error',
                    'message' => 'Limite deve ser um número positivo',
                ],
                httpCode: 400
            ))->send();
            exit();
        }
        return $this;
    }
}