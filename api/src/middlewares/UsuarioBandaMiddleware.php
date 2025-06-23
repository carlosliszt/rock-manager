<?php

require_once "api/src/DAO/UsuarioBandaDAO.php";
require_once "api/src/http/Response.php";

class UsuarioBandaMiddleware
{
    public function stringJsonToStdClass($requestBody): \stdClass
    {
        $stdVinculo = json_decode($requestBody);

        if (json_last_error() !== JSON_ERROR_NONE) {
            (new Response(
                success: false,
                message: 'Vínculo inválido',
                error: [
                    'code' => 'validation_error',
                    'message' => 'Json inválido',
                ],
                httpCode: 400
            ))->send();
            exit();
        } else if (!isset($stdVinculo->usuario_banda)) {
            (new Response(
                success: false,
                message: 'Vínculo inválido',
                error: [
                    'code' => 'validation_error',
                    'message' => 'Não foi enviado o objeto usuario_banda',
                ],
                httpCode: 400
            ))->send();
            exit();
        } else if (
            !isset($stdVinculo->usuario_banda->id_usuario) ||
            !isset($stdVinculo->usuario_banda->id_banda) ||
            !isset($stdVinculo->usuario_banda->funcao)
        ) {
            (new Response(
                success: false,
                message: 'Vínculo inválido',
                error: [
                    'code' => 'validation_error',
                    'message' => 'Atributos obrigatórios (id_usuario, id_banda, funcao) não enviados',
                ],
                httpCode: 400
            ))->send();
            exit();
        }

        return $stdVinculo;
    }

    public function hasMembersInBanda($id_banda): self
    {
        $dao = new UsuarioBandaDAO();
        $members = $dao->readAll();
        $hasMember = false;

        foreach ($members as $v) {
            if ($v->getIdBanda() == $id_banda) {
                $hasMember = true;
                break;
            }
        }

        if (!$hasMember) {
            (new Response(
                success: false,
                message: 'A banda não possui membros',
                error: [
                    'code' => 'validation_error',
                    'message' => 'Nenhum membro encontrado para a banda informada',
                ],
                httpCode: 404
            ))->send();
            exit();
        }

        return $this;
    }

    public function isValidIds($id_usuario, $id_banda): self
    {
        if (!isset($id_usuario) || !isset($id_banda)) {
            (new Response(
                success: false,
                message: 'IDs não enviados',
                error: [
                    'code' => 'validation_error',
                    'message' => 'Os ids fornecidos não são válidos'
                ],
                httpCode: 400
            ))->send();
            exit();
        } else if (!is_numeric($id_usuario) || !is_numeric($id_banda)) {
            (new Response(
                success: false,
                message: 'IDs não são números',
                error: [
                    'code' => 'validation_error',
                    'message' => 'Os ids fornecidos não são números'
                ],
                httpCode: 400
            ))->send();
            exit();
        } else if ($id_usuario <= 0 || $id_banda <= 0) {
            (new Response(
                success: false,
                message: 'IDs não são positivos',
                error: [
                    'code' => 'validation_error',
                    'message' => 'Os ids fornecidos não são positivos'
                ],
                httpCode: 400
            ))->send();
            exit();
        }
        return $this;
    }

    public function isValidFuncao($funcao): self
    {
        if (!isset($funcao) || strlen(trim($funcao)) < 3) {
            (new Response(
                success: false,
                message: 'Função inválida',
                error: [
                    'code' => 'validation_error',
                    'message' => 'A função deve ter pelo menos 3 caracteres'
                ],
                httpCode: 400
            ))->send();
            exit();
        }
        return $this;
    }

    public function hasVinculoByIds($id_usuario, $id_banda): self
    {
        $dao = new UsuarioBandaDAO();
        $vinculo = $dao->readById($id_usuario, $id_banda);
        if (!isset($vinculo)) {
            (new Response(
                success: false,
                message: "Não existe vínculo com os ids fornecidos",
                error: [
                    'code' => 'validation_error',
                    'message' => 'Vínculo informado não existente',
                ],
                httpCode: 400
            ))->send();
            exit();
        }
        return $this;
    }

    public function hasNotVinculoByIds($id_usuario, $id_banda): self
    {
        $dao = new UsuarioBandaDAO();
        $vinculo = $dao->readById($id_usuario, $id_banda);

        if ($vinculo !== null) {
            (new Response(
                success: false,
                message: "Já existe um vínculo com os IDs fornecidos ($id_usuario, $id_banda)",
                error: [
                    'code' => 'validation_error',
                    'message' => 'IDs de vínculo já estão em uso',
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