<?php

require_once "api/src/models/Show.php";
require_once "api/src/DAO/ShowDAO.php";
require_once "api/src/http/Response.php";
require_once "api/src/utils/Logger.php";

class ShowController
{
    public function index(): never
    {
        $showDAO = new ShowDAO();
        $shows = $showDAO->readAll();
        (new Response(
            success: true,
            message: 'Shows selecionados com sucesso',
            data: ['shows' => $shows],
            httpCode: 200
        ))->send();
        exit();
    }

    public function show(int $idShow): never
    {
        $showDAO = new ShowDAO();
        $show = $showDAO->readById($idShow);
        if ($show) {
            (new Response(
                success: true,
                message: 'Show encontrado com sucesso',
                data: ['shows' => $show],
                httpCode: 200
            ))->send();
        } else {
            (new Response(
                success: false,
                message: 'Show não encontrado',
                httpCode: 404
            ))->send();
        }
        exit();
    }

    public function listPaginated(int $page = 1, int $limit = 10): never
    {
        if ($page < 1) $page = 1;
        if ($limit < 1) $limit = 10;
        $showDAO = new ShowDAO();
        $shows = $showDAO->readByPage($page, $limit);
        (new Response(
            success: true,
            message: 'Shows recuperados com sucesso',
            data: [
                'page' => $page,
                'limit' => $limit,
                'shows' => $shows
            ],
            httpCode: 200
        ))->send();
        exit();
    }

    public function store(stdClass $stdShow): never
    {
        $s = $stdShow->show;
        $show = new Show(
            0,
            $s->local,
            $s->data,
            $s->publico_estimado ?? null
        );
        $showDAO = new ShowDAO();
        $novoShow = $showDAO->create($show);
        (new Response(
            success: true,
            message: 'Show cadastrado com sucesso',
            data: ['shows' => $novoShow],
            httpCode: 200
        ))->send();
        exit();
    }

    public function edit(stdClass $stdShow): never
    {
        $s = $stdShow->show;
        $show = new Show(
            $s->id,
            $s->local,
            $s->data,
            $s->publico_estimado ?? null
        );
        $showDAO = new ShowDAO();
        if ($showDAO->update($show)) {
            (new Response(
                success: true,
                message: "Atualizado com sucesso",
                data: ['shows' => $show],
                httpCode: 200
            ))->send();
        } else {
            (new Response(
                success: false,
                message: "Não foi possível atualizar o show.",
                error: [
                    'codigoError' => 'validation_error',
                    'message' => 'Não é possível atualizar para um show que já existe',
                ],
                httpCode: 400
            ))->send();
        }
        exit();
    }

    public function destroy(int $idShow): never
    {
        $showDAO = new ShowDAO();
        if ($showDAO->delete($idShow)) {
            (new Response(httpCode: 204))->send();
        } else {
            (new Response(
                success: false,
                message: 'Não foi possível excluir o show',
                error: [
                    'cod' => 'delete_error',
                    'message' => 'O show não pode ser excluído'
                ],
                httpCode: 400
            ))->send();
        }
        exit();
    }

    public function exportCSV(): never
    {
        $showDAO = new ShowDAO();
        $shows = $showDAO->readAll();
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="shows.csv"');
        $saida = fopen('php://output', 'w');
        fputcsv($saida, ['ID', 'Local', 'Data', 'Público Estimado']);
        foreach ($shows as $show) {
            fputcsv($saida, [
                $show->getId(),
                $show->getLocal(),
                $show->getData(),
                $show->getPublicoEstimado()
            ]);
        }
        fclose($saida);
        exit();
    }

    public function exportJSON(): never
    {
        $showDAO = new ShowDAO();
        $shows = $showDAO->readAll();
        header('Content-Type: application/json; charset=utf-8');
        header('Content-Disposition: attachment; filename="shows.json"');
        echo json_encode(['shows' => $shows]);
        exit();
    }

    public function exportXML(): never
    {
        $showDAO = new ShowDAO();
        $shows = $showDAO->readAll();
        header('Content-Type: application/xml; charset=utf-8');
        header('Content-Disposition: attachment; filename="shows.xml"');
        $xml = new SimpleXMLElement('<shows/>');
        foreach ($shows as $show) {
            $showXML = $xml->addChild('show');
            $showXML->addChild('id', $show->getId());
            $showXML->addChild('local', $show->getLocal());
            $showXML->addChild('data', $show->getData());
            $showXML->addChild('publico_estimado', $show->getPublicoEstimado());
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
        $showDAO = new ShowDAO();
        $showsCriados = [];
        $showsNaoCriados = [];
        foreach ($xml->show as $showNode) {
            $show = new Show(
                (int) $showNode->id,
                (string) $showNode->local,
                (string) $showNode->data,
                isset($showNode->publico_estimado) ? (int) $showNode->publico_estimado : null
            );
            $showCriado = $showDAO->create($show);
            if ($showCriado == false) {
                $showsNaoCriados[] = $show;
            } else {
                $showsCriados[] = $show;
            }
        }
        (new Response(
            success: true,
            message: 'Importação realizada com sucesso',
            data: [
                "showsCriados" => $showsCriados,
                "showsNaoCriados" => $showsNaoCriados,
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
        $showDAO = new ShowDAO();
        $showsCriados = [];
        $showsNaoCriados = [];
        while (($linhaArquivo = fgetcsv($ponteiroArquivo, 1000, ",")) !== false) {
            foreach ($linhaArquivo as &$campo) {
                if (!mb_detect_encoding($campo, 'UTF-8', true)) {
                    $campo = mb_convert_encoding($campo, 'UTF-8', 'ISO-8859-1');
                }
            }
            if (count($linhaArquivo) < 4) continue;
            $show = new Show(
                (int) $linhaArquivo[0],
                $linhaArquivo[1],
                $linhaArquivo[2],
                $linhaArquivo[3] !== "" ? (int) $linhaArquivo[3] : null
            );
            $showCriado = $showDAO->create($show);
            if ($showCriado == false) {
                $showsNaoCriados[] = $show;
            } else {
                $showsCriados[] = $show;
            }
        }
        fclose($ponteiroArquivo);
        (new Response(
            success: true,
            message: 'Importação executada com sucesso.',
            data: [
                "showsCriados" => $showsCriados,
                "showsNaoCriados" => $showsNaoCriados,
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
        if (!isset($dadosJson->shows)) {
            (new Response(
                success: false,
                message: 'Dados de shows não encontrados no JSON',
                httpCode: 400
            ))->send();
            exit();
        }
        $showDAO = new ShowDAO();
        $showsCriados = [];
        $showsNaoCriados = [];
        foreach ($dadosJson->shows as $showNode) {
            $show = new Show(
                (int) $showNode->id,
                (string) $showNode->local,
                (string) $showNode->data,
                isset($showNode->publico_estimado) ? (int) $showNode->publico_estimado : null
            );
            $showCriado = $showDAO->create($show);
            if ($showCriado == false) {
                $showsNaoCriados[] = $show;
            } else {
                $showsCriados[] = $show;
            }
        }
        (new Response(
            success: true,
            message: 'Importação realizada com sucesso',
            data: [
                "showsCriados" => $showsCriados,
                "showsNaoCriados" => $showsNaoCriados,
            ],
            httpCode: 200
        ))->send();
        exit();
    }
}