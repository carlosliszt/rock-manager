<?php

require_once "api/src/models/Banda.php";
require_once "api/src/DAO/BandaDAO.php";
require_once "api/src/http/Response.php";
require_once "api/src/utils/Logger.php";

class BandaController
{
    public function index(): never
    {
        $bandaDAO = new BandaDAO();
        $bandas = $bandaDAO->readAll();
        (new Response(
            success: true,
            message: 'Bandas selecionadas com sucesso',
            data: ['bandas' => $bandas],
            httpCode: 200
        ))->send();
        exit();
    }

    public function show(int $idBanda): never
    {
        $bandaDAO = new BandaDAO();
        $banda = $bandaDAO->readById($idBanda);
        if ($banda) {
            (new Response(
                success: true,
                message: 'Banda encontrada com sucesso',
                data: ['bandas' => $banda],
                httpCode: 200
            ))->send();
        } else {
            (new Response(
                success: false,
                message: 'Banda não encontrada',
                httpCode: 404
            ))->send();
        }
        exit();
    }

    public function listPaginated(int $page = 1, int $limit = 10): never
    {
        if ($page < 1) $page = 1;
        if ($limit < 1) $limit = 10;
        $bandaDAO = new BandaDAO();
        $bandas = $bandaDAO->readByPage($page, $limit);
        (new Response(
            success: true,
            message: 'Bandas recuperadas com sucesso',
            data: [
                'page' => $page,
                'limit' => $limit,
                'bandas' => $bandas
            ],
            httpCode: 200
        ))->send();
        exit();
    }

    public function store(stdClass $stdBanda): never
    {
        $b = $stdBanda->banda;
        $banda = new Banda(
            0,
            $b->nome,
            $b->pais_origem ?? null,
            $b->ano_formacao ?? null,
            $b->genero ?? null
        );
        $bandaDAO = new BandaDAO();
        $novaBanda = $bandaDAO->create($banda);
        (new Response(
            success: true,
            message: 'Banda cadastrada com sucesso',
            data: ['bandas' => $novaBanda],
            httpCode: 200
        ))->send();
        exit();
    }

    public function edit(stdClass $stdBanda): never
    {
        $b = $stdBanda->banda;
        $banda = new Banda(
            $b->id,
            $b->nome,
            $b->pais_origem ?? null,
            $b->ano_formacao ?? null,
            $b->genero ?? null
        );
        $bandaDAO = new BandaDAO();
        if ($bandaDAO->update($banda)) {
            (new Response(
                success: true,
                message: "Atualizada com sucesso",
                data: ['bandas' => $banda],
                httpCode: 200
            ))->send();
        } else {
            (new Response(
                success: false,
                message: "Não foi possível atualizar a banda.",
                error: [
                    'code' => 'validation_error',
                    'message' => 'Não é possível atualizar para uma banda que já existe',
                ],
                httpCode: 400
            ))->send();
        }
        exit();
    }

    public function destroy(int $idBanda): never
    {
        $bandaDAO = new BandaDAO();
        if ($bandaDAO->delete($idBanda)) {
            (new Response(httpCode: 204))->send();
        } else {
            (new Response(
                success: false,
                message: 'Não foi possível excluir a banda',
                error: [
                    'code' => 'delete_error',
                    'message' => 'A banda não pode ser excluída'
                ],
                httpCode: 400
            ))->send();
        }
        exit();
    }

    public function exportCSV(): never
    {
        $bandaDAO = new BandaDAO();
        $bandas = $bandaDAO->readAll();
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="bandas.csv"');
        $saida = fopen('php://output', 'w');
        fputcsv($saida, ['ID', 'Nome', 'País de Origem', 'Ano de Formação', 'Gênero']);
        foreach ($bandas as $banda) {
            fputcsv($saida, [
                $banda->getId(),
                $banda->getNome(),
                $banda->getPaisOrigem(),
                $banda->getAnoFormacao(),
                $banda->getGenero()
            ]);
        }
        fclose($saida);
        exit();
    }

    public function exportJSON(): never
    {
        $bandaDAO = new BandaDAO();
        $bandas = $bandaDAO->readAll();
        header('Content-Type: application/json; charset=utf-8');
        header('Content-Disposition: attachment; filename="bandas.json"');
        echo json_encode(['bandas' => $bandas]);
        exit();
    }

    public function exportXML(): never
    {
        $bandaDAO = new BandaDAO();
        $bandas = $bandaDAO->readAll();
        header('Content-Type: application/xml; charset=utf-8');
        header('Content-Disposition: attachment; filename="bandas.xml"');
        $xml = new SimpleXMLElement('<bandas/>');
        foreach ($bandas as $banda) {
            $bandaXML = $xml->addChild('banda');
            $bandaXML->addChild('id', $banda->getId());
            $bandaXML->addChild('nome', $banda->getNome());
            $bandaXML->addChild('pais_origem', $banda->getPaisOrigem());
            $bandaXML->addChild('ano_formacao', $banda->getAnoFormacao());
            $bandaXML->addChild('genero', $banda->getGenero());
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
        $bandaDAO = new BandaDAO();
        $bandasCriadas = [];
        $bandasNaoCriadas = [];
        foreach ($xml->banda as $bandaNode) {
            $banda = new Banda(
                (int) $bandaNode->id,
                (string) $bandaNode->nome,
                (string) $bandaNode->pais_origem ?: null,
                (int) $bandaNode->ano_formacao ?: null,
                (string) $bandaNode->genero ?: null
            );
            $bandaCriada = $bandaDAO->create($banda);
            if ($bandaCriada == false) {
                $bandasNaoCriadas[] = $banda;
            } else {
                $bandasCriadas[] = $banda;
            }
        }
        (new Response(
            success: true,
            message: 'Importação realizada com sucesso',
            data: [
                "bandasCriadas" => $bandasCriadas,
                "bandasNaoCriadas" => $bandasNaoCriadas,
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
        $bandaDAO = new BandaDAO();
        $bandasCriadas = [];
        $bandasNaoCriadas = [];
        while (($linhaArquivo = fgetcsv($ponteiroArquivo, 1000, ",")) !== false) {
            foreach ($linhaArquivo as &$campo) {
                if (!mb_detect_encoding($campo, 'UTF-8', true)) {
                    $campo = mb_convert_encoding($campo, 'UTF-8', 'ISO-8859-1');
                }
            }
            if (count($linhaArquivo) < 5) continue;
            $banda = new Banda(
                (int) $linhaArquivo[0],
                $linhaArquivo[1],
                $linhaArquivo[2] ?: null,
                $linhaArquivo[3] !== "" ? (int) $linhaArquivo[3] : null,
                $linhaArquivo[4] ?: null
            );
            $bandaCriada = $bandaDAO->create($banda);
            if ($bandaCriada == false) {
                $bandasNaoCriadas[] = $banda;
            } else {
                $bandasCriadas[] = $banda;
            }
        }
        fclose($ponteiroArquivo);
        (new Response(
            success: true,
            message: 'Importação executada com sucesso.',
            data: [
                "bandasCriadas" => $bandasCriadas,
                "bandasNaoCriadas" => $bandasNaoCriadas,
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
        if (!isset($dadosJson->bandas)) {
            (new Response(
                success: false,
                message: 'Dados de bandas não encontrados no JSON',
                httpCode: 400
            ))->send();
            exit();
        }
        $bandaDAO = new BandaDAO();
        $bandasCriadas = [];
        $bandasNaoCriadas = [];
        foreach ($dadosJson->bandas as $bandaNode) {
            $banda = new Banda(
                (int) $bandaNode->id,
                (string) $bandaNode->nome,
                isset($bandaNode->pais_origem) ? (string) $bandaNode->pais_origem : null,
                isset($bandaNode->ano_formacao) ? (int) $bandaNode->ano_formacao : null,
                isset($bandaNode->genero) ? (string) $bandaNode->genero : null
            );
            $bandaCriada = $bandaDAO->create($banda);
            if ($bandaCriada == false) {
                $bandasNaoCriadas[] = $banda;
            } else {
                $bandasCriadas[] = $banda;
            }
        }
        (new Response(
            success: true,
            message: 'Importação realizada com sucesso',
            data: [
                "bandasCriadas" => $bandasCriadas,
                "bandasNaoCriadas" => $bandasNaoCriadas,
            ],
            httpCode: 200
        ))->send();
        exit();
    }
}