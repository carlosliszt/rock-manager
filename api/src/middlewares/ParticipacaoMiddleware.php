<?php

require_once "api/src/DAO/ParticipacaoDAO.php";
require_once "api/src/http/Response.php";

class ParticipacaoMiddleware
{
    public function stringJsonToStdClass($requestBody): \stdClass
    {
        $stdParticipacao = json_decode($requestBody);

        if (json_last_error() !== JSON_ERROR_NONE) {
            (new Response(
                success: false,
                message: 'Participação inválida',
                error: [
                    'code' => 'validation_error',
                    'message' => 'Json inválido',
                ],
                httpCode: 400
            ))->send();
            exit();
        } else if (!isset($stdParticipacao->participacao)) {
            (new Response(
                success: false,
                message: 'Participação inválida',
                error: [
                    'code' => 'validation_error',
                    'message' => 'Não foi enviado o objeto Participacao',
                ],
                httpCode: 400
            ))->send();
            exit();
        } else if (
            !isset($stdParticipacao->participacao->id_banda) ||
            !isset($stdParticipacao->participacao->id_show)
        ) {
            (new Response(
                success: false,
                message: 'Participação inválida',
                error: [
                    'code' => 'validation_error',
                    'message' => 'Atributos obrigatórios (id_banda, id_show) não enviados',
                ],
                httpCode: 400
            ))->send();
            exit();
        }

        return $stdParticipacao;
    }

    public function hasShowsByBanda($id_banda): self
    {
        $participacaoDAO = new ParticipacaoDAO();
        $participacoes = $participacaoDAO->readByBanda($id_banda);

        if (empty($participacoes)) {
            (new Response(
                success: false,
                message: 'A banda não possui shows cadastrados',
                error: [
                    'code' => 'banda_sem_shows',
                    'message' => 'Nenhum show encontrado para a banda informada'
                ],
                httpCode: 404
            ))->send();
            exit();
        }
        return $this;
    }

    public function isValidIds($id_banda, $id_show): self
    {
        if (!isset($id_banda) || !isset($id_show)) {
            (new Response(
                success: false,
                message: 'IDs da participação não foram enviados',
                error: [
                    'code' => 'participacao_validation_error',
                    'message' => 'Os ids fornecidos não são válidos'
                ],
                httpCode: 400
            ))->send();
            exit();
        } else if (!is_numeric($id_banda) || !is_numeric($id_show)) {
            (new Response(
                success: false,
                message: 'IDs da participação não são números',
                error: [
                    'code' => 'participacao_validation_error',
                    'message' => 'Os ids fornecidos não são números'
                ],
                httpCode: 400
            ))->send();
            exit();
        } else if ($id_banda <= 0 || $id_show <= 0) {
            (new Response(
                success: false,
                message: 'IDs da participação não são positivos',
                error: [
                    'code' => 'participacao_validation_error',
                    'message' => 'Os ids fornecidos não são positivos'
                ],
                httpCode: 400
            ))->send();
            exit();
        }
        return $this;
    }

    public function hasParticipacaoByIds($id_banda, $id_show): self
    {
        $participacaoDAO = new ParticipacaoDAO();
        $participacao = $participacaoDAO->readById($id_banda, $id_show);
        if (!isset($participacao)) {
            (new Response(
                success: false,
                message: "Não existe uma participação com os ids fornecidos",
                error: [
                    'code' => 'validation_error',
                    'message' => 'Participação informada não existente',
                ],
                httpCode: 400
            ))->send();
            exit();
        }
        return $this;
    }

    public function hasNotParticipacaoByIds($id_banda, $id_show): self
    {
        $participacaoDAO = new ParticipacaoDAO();
        $participacao = $participacaoDAO->readById($id_banda, $id_show);

        if ($participacao !== null) {
            (new Response(
                success: false,
                message: "Já existe uma participação com os IDs fornecidos ($id_banda, $id_show)",
                error: [
                    'code' => 'validation_error',
                    'message' => 'IDs de participação já estão em uso',
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