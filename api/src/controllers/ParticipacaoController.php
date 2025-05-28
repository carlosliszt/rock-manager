<?php

require_once "api/src/models/Participacao.php";
require_once "api/src/DAO/ParticipacaoDAO.php";
require_once "api/src/http/Response.php";
require_once "api/src/utils/Logger.php";

class ParticipacaoController
{
    public function index(): never
    {
        $participacaoDAO = new ParticipacaoDAO();
        $participacoes = $participacaoDAO->readAll();
        (new Response(
            success: true,
            message: 'Participações selecionadas com sucesso',
            data: ['participacoes' => $participacoes],
            httpCode: 200
        ))->send();
        exit();
    }

    public function show(int $id_banda, int $id_show): never
    {
        $participacaoDAO = new ParticipacaoDAO();
        $participacao = $participacaoDAO->readById($id_banda, $id_show);
        if ($participacao) {
            (new Response(
                success: true,
                message: 'Participação encontrada com sucesso',
                data: ['participacao' => $participacao],
                httpCode: 200
            ))->send();
        } else {
            (new Response(
                success: false,
                message: 'Participação não encontrada',
                httpCode: 404
            ))->send();
        }
        exit();
    }

    public function listPaginated(int $page = 1, int $limit = 10): never
    {
        if ($page < 1) $page = 1;
        if ($limit < 1) $limit = 10;
        $participacaoDAO = new ParticipacaoDAO();
        $participacoes = $participacaoDAO->readByPage($page, $limit);
        (new Response(
            success: true,
            message: 'Participações recuperadas com sucesso',
            data: [
                'page' => $page,
                'limit' => $limit,
                'participacoes' => $participacoes
            ],
            httpCode: 200
        ))->send();
        exit();
    }

    public function store(stdClass $stdParticipacao): never
    {
        $p = $stdParticipacao->participacao;
        $participacao = new Participacao(
            $p->id_banda,
            $p->id_show,
            $p->ordem_apresentacao,
            $p->tempo_execucao_min
        );
        $participacaoDAO = new ParticipacaoDAO();
        $novaParticipacao = $participacaoDAO->create($participacao);
        (new Response(
            success: true,
            message: 'Participação cadastrada com sucesso',
            data: ['participacao' => $novaParticipacao],
            httpCode: 200
        ))->send();
        exit();
    }

    public function edit(stdClass $stdParticipacao): never
    {
        $p = $stdParticipacao->participacao;
        $participacao = new Participacao(
            $p->id_banda,
            $p->id_show,
            $p->ordem_apresentacao,
            $p->tempo_execucao_min
        );
        $participacaoDAO = new ParticipacaoDAO();
        if ($participacaoDAO->update($participacao)) {
            (new Response(
                success: true,
                message: "Atualizada com sucesso",
                data: ['participacao' => $participacao],
                httpCode: 200
            ))->send();
        } else {
            (new Response(
                success: false,
                message: "Não foi possível atualizar a participação.",
                error: [
                    'codigoError' => 'validation_error',
                    'message' => 'Não é possível atualizar a participação',
                ],
                httpCode: 400
            ))->send();
        }
        exit();
    }

    public function destroy(int $id_banda, int $id_show): never
    {
        $participacaoDAO = new ParticipacaoDAO();
        if ($participacaoDAO->delete($id_banda, $id_show)) {
            (new Response(httpCode: 204))->send();
        } else {
            (new Response(
                success: false,
                message: 'Não foi possível excluir a participação',
                error: [
                    'cod' => 'delete_error',
                    'message' => 'A participação não pode ser excluída'
                ],
                httpCode: 400
            ))->send();
        }
        exit();
    }

    public function exportCSV(): never
    {
        $participacaoDAO = new ParticipacaoDAO();
        $participacoes = $participacaoDAO->readAll();
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="participacoes.csv"');
        $saida = fopen('php://output', 'w');
        fputcsv($saida, ['ID Banda', 'ID Show', 'Ordem Apresentação', 'Tempo Execução (min)']);
        foreach ($participacoes as $participacao) {
            fputcsv($saida, [
                $participacao->getIdBanda(),
                $participacao->getIdShow(),
                $participacao->getOrdemApresentacao(),
                $participacao->getTempoExecucaoMin()
            ]);
        }
        fclose($saida);
        exit();
    }

    public function exportJSON(): never
    {
        $participacaoDAO = new ParticipacaoDAO();
        $participacoes = $participacaoDAO->readAll();
        header('Content-Type: application/json; charset=utf-8');
        header('Content-Disposition: attachment; filename="participacoes.json"');
        echo json_encode(['participacoes' => $participacoes]);
        exit();
    }

    public function exportXML(): never
    {
        $participacaoDAO = new ParticipacaoDAO();
        $participacoes = $participacaoDAO->readAll();
        header('Content-Type: application/xml; charset=utf-8');
        header('Content-Disposition: attachment; filename="participacoes.xml"');
        $xml = new SimpleXMLElement('<participacoes/>');
        foreach ($participacoes as $participacao) {
            $participacaoXML = $xml->addChild('participacao');
            $participacaoXML->addChild('id_banda', $participacao->getIdBanda());
            $participacaoXML->addChild('id_show', $participacao->getIdShow());
            $participacaoXML->addChild('ordem_apresentacao', $participacao->getOrdemApresentacao());
            $participacaoXML->addChild('tempo_execucao_min', $participacao->getTempoExecucaoMin());
        }
        echo $xml->asXML();
        exit();
    }

    public function importXML(array $xmlFile): never
    {
        $nomeTemporario = $xmlFile['tmp_name'];
        $xml = simplexml_load_file($nomeTemporario);
        if (!$xml) {
            (new Response(
                success: false,
                message: 'Erro ao carregar o arquivo XML',
                httpCode: 400
            ))->send();
            exit();
        }
        $participacaoDAO = new ParticipacaoDAO();
        $participacoesCriadas = [];
        $participacoesNaoCriadas = [];
        foreach ($xml->participacao as $pNode) {
            $participacao = new Participacao(
                (int) $pNode->id_banda,
                (int) $pNode->id_show,
                (int) $pNode->ordem_apresentacao,
                (int) $pNode->tempo_execucao_min
            );
            $participacaoCriada = $participacaoDAO->create($participacao);
            if ($participacaoCriada == false) {
                $participacoesNaoCriadas[] = $participacao;
            } else {
                $participacoesCriadas[] = $participacao;
            }
        }
        (new Response(
            success: true,
            message: 'Importação realizada com sucesso',
            data: [
                "participacoesCriadas" => $participacoesCriadas,
                "participacoesNaoCriadas" => $participacoesNaoCriadas,
            ],
            httpCode: 200
        ))->send();
        exit();
    }

    public function importCSV(array $csvFile): never
    {
        $nomeTemporario = $csvFile['tmp_name'];
        if (!is_uploaded_file($nomeTemporario)) {
            (new Response(
                success: false,
                message: 'Arquivo inválido.',
                httpCode: 400
            ))->send();
            exit();
        }
        $ponteiroArquivo = fopen($nomeTemporario, "r");
        if ($ponteiroArquivo === false) {
            (new Response(
                success: false,
                message: 'Não foi possível abrir o arquivo.',
                httpCode: 500
            ))->send();
            exit();
        }
        $participacaoDAO = new ParticipacaoDAO();
        $participacoesCriadas = [];
        $participacoesNaoCriadas = [];
        while (($linhaArquivo = fgetcsv($ponteiroArquivo, 1000, ",")) !== false) {
            foreach ($linhaArquivo as &$campo) {
                if (!mb_detect_encoding($campo, 'UTF-8', true)) {
                    $campo = mb_convert_encoding($campo, 'UTF-8', 'ISO-8859-1');
                }
            }
            if (count($linhaArquivo) < 4) continue;
            $participacao = new Participacao(
                (int) $linhaArquivo[0],
                (int) $linhaArquivo[1],
                (int) $linhaArquivo[2],
                (int) $linhaArquivo[3]
            );
            $participacaoCriada = $participacaoDAO->create($participacao);
            if ($participacaoCriada == false) {
                $participacoesNaoCriadas[] = $participacao;
            } else {
                $participacoesCriadas[] = $participacao;
            }
        }
        fclose($ponteiroArquivo);
        (new Response(
            success: true,
            message: 'Importação executada com sucesso.',
            data: [
                "participacoesCriadas" => $participacoesCriadas,
                "participacoesNaoCriadas" => $participacoesNaoCriadas,
            ],
            httpCode: 200
        ))->send();
        exit();
    }

    public function importJson(array $jsonFile): never
    {
        $nomeTemporario = $jsonFile['tmp_name'];
        $conteudoArquivo = file_get_contents($nomeTemporario);
        $dadosJson = json_decode($conteudoArquivo);
        if ($dadosJson === null) {
            (new Response(
                success: false,
                message: 'Erro ao decodificar o arquivo JSON',
                httpCode: 400
            ))->send();
            exit();
        }
        if (!isset($dadosJson->participacoes)) {
            (new Response(
                success: false,
                message: 'Dados de participações não encontrados no JSON',
                httpCode: 400
            ))->send();
            exit();
        }
        $participacaoDAO = new ParticipacaoDAO();
        $participacoesCriadas = [];
        $participacoesNaoCriadas = [];
        foreach ($dadosJson->participacoes as $pNode) {
            $participacao = new Participacao(
                (int) $pNode->id_banda,
                (int) $pNode->id_show,
                (int) $pNode->ordem_apresentacao,
                (int) $pNode->tempo_execucao_min
            );
            $participacaoCriada = $participacaoDAO->create($participacao);
            if ($participacaoCriada == false) {
                $participacoesNaoCriadas[] = $participacao;
            } else {
                $participacoesCriadas[] = $participacao;
            }
        }
        (new Response(
            success: true,
            message: 'Importação realizada com sucesso',
            data: [
                "participacoesCriadas" => $participacoesCriadas,
                "participacoesNaoCriadas" => $participacoesNaoCriadas,
            ],
            httpCode: 200
        ))->send();
        exit();
    }
}