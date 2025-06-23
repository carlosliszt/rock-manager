<?php

require_once 'api/src/models/UsuarioBanda.php';
require_once 'api/src/DAO/UsuarioBandaDAO.php';
require_once 'api/src/http/Response.php';

class UsuarioBandaController
{
    public function index(): never
    {
        $dao = new UsuarioBandaDAO();
        $members = $dao->readAll();
        $namedMembers = array_map(function($v) {
            return [
                'id_usuario' => $v->getIdUsuario(),
                'nome_usuario' => $v->getNomeUsuario(),
                'id_banda' => $v->getIdBanda(),
                'nome_banda' => $v->getNomeBanda(),
                'funcao' => $v->getFuncao()
            ];
        }, $members);

        (new Response(
            success: true,
            message: 'Membros selecionados com sucesso',
            data: ['members' => $namedMembers],
            httpCode: 200
        ))->send();
        exit();
    }

    public function showByBand(int $id_banda): never
    {
        $dao = new UsuarioBandaDAO();
        $members = $dao->readAll();
        $membrosBanda = [];

        foreach ($members as $v) {
            if ($v->getIdBanda() === $id_banda) {
                $membrosBanda[] = [
                    'id_usuario' => $v->getIdUsuario(),
                    'nome_usuario' => $v->getNomeUsuario(),
                    'funcao' => $v->getFuncao()
                ];
                $nomeBanda = $v->getNomeBanda();
            }
        }

        (new Response(
            success: true,
            message: 'Membros da banda selecionados com sucesso',
            data: [
                'id_banda' => $id_banda,
                'nome_banda' => $nomeBanda ?? null,
                'membros' => $membrosBanda
            ],
            httpCode: 200
        ))->send();
        exit();
    }

    public function show(int $id_usuario, int $id_banda): never
    {
        $dao = new UsuarioBandaDAO();
        $m = $dao->readById($id_usuario, $id_banda);
        if ($m) {
            $member = [
                'id_usuario' => $m->getIdUsuario(),
                'nome_usuario' => $m->getNomeUsuario(),
                'id_banda' => $m->getIdBanda(),
                'nome_banda' => $m->getNomeBanda(),
                'funcao' => $m->getFuncao()
            ];
            (new Response(
                success: true,
                message: 'Membro encontrado com sucesso',
                data: ['member' => $member],
                httpCode: 200
            ))->send();
        } else {
            (new Response(
                success: false,
                message: 'Membro não encontrado',
                httpCode: 404
            ))->send();
        }
        exit();
    }

    public function listPaginated(int $page = 1, int $limit = 10): never
    {
        if ($page < 1) $page = 1;
        if ($limit < 1) $limit = 10;
        $dao = new UsuarioBandaDAO();
        $members = $dao->readByPage($page, $limit);
        $namedMembers = array_map(function($v) {
            return [
                'id_usuario' => $v->getIdUsuario(),
                'nome_usuario' => $v->getNomeUsuario(),
                'id_banda' => $v->getIdBanda(),
                'nome_banda' => $v->getNomeBanda(),
                'funcao' => $v->getFuncao()
            ];
        }, $members);

        (new Response(
            success: true,
            message: 'Membros recuperados com sucesso',
            data: [
                'page' => $page,
                'limit' => $limit,
                'members' => $namedMembers
            ],
            httpCode: 200
        ))->send();
        exit();
    }
    
    public function store(stdClass $stdMembro): never
    {
        $v = $stdMembro->usuario_banda;
        $usuarioBanda = new UsuarioBanda(
            $v->id_usuario,
            $v->id_banda,
            $v->funcao
        );
        $dao = new UsuarioBandaDAO();
        $novoMembro = $dao->create($usuarioBanda);
        (new Response(
            success: true,
            message: 'Membro criado com sucesso',
            data: ['member' => $novoMembro],
            httpCode: 200
        ))->send();
        exit();
    }

    public function edit(stdClass $stdMembro): never
    {
        $v = $stdMembro->usuario_banda;
        $usuarioBanda = new UsuarioBanda(
            $v->id_usuario,
            $v->id_banda,
            $v->funcao
        );
        $dao = new UsuarioBandaDAO();
        if ($dao->update($usuarioBanda)) {
            (new Response(
                success: true,
                message: "Atualizado com sucesso",
                data: ['member' => $usuarioBanda],
                httpCode: 200
            ))->send();
        } else {
            (new Response(
                success: false,
                message: "Não foi possível atualizar o membro.",
                error: [
                    'code' => 'validation_error',
                    'message' => 'Não é possível atualizar o membro',
                ],
                httpCode: 400
            ))->send();
        }
        exit();
    }

    public function destroy(int $id_usuario, int $id_banda): never
    {
        $dao = new UsuarioBandaDAO();
        if ($dao->delete($id_usuario, $id_banda)) {
            (new Response(httpCode: 204))->send();
        } else {
            (new Response(
                success: false,
                message: 'Não foi possível remover o membro',
                httpCode: 400
            ))->send();
        }
        exit();
    }

    public function exportCSV(): never
    {
        $dao = new UsuarioBandaDAO();
        $membros = $dao->readAll();
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="usuario_banda.csv"');
        $saida = fopen('php://output', 'w');
        fputcsv($saida, ['ID Usuário', 'ID Banda', 'Função']);
        foreach ($membros as $v) {
            fputcsv($saida, [
                $v->getIdUsuario(),
                $v->getIdBanda(),
                $v->getFuncao()
            ]);
        }
        fclose($saida);
        exit();
    }

    public function exportJSON(): never
    {
        $dao = new UsuarioBandaDAO();
        $membros = $dao->readAll();
        header('Content-Type: application/json; charset=utf-8');
        header('Content-Disposition: attachment; filename="usuario_banda.json"');
        echo json_encode(['members' => $membros]);
        exit();
    }

    public function exportXML(): never
    {
        $dao = new UsuarioBandaDAO();
        $membros = $dao->readAll();
        header('Content-Type: application/xml; charset=utf-8');
        header('Content-Disposition: attachment; filename="usuario_banda.xml"');
        $xml = new SimpleXMLElement('<membros/>');
        foreach ($membros as $v) {
            $membroXML = $xml->addChild('membro');
            $membroXML->addChild('id_usuario', $v->getIdUsuario());
            $membroXML->addChild('id_banda', $v->getIdBanda());
            $membroXML->addChild('funcao', $v->getFuncao());
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
        $dao = new UsuarioBandaDAO();
        $membrosCriados = [];
        $membrosNaoCriados = [];
        foreach ($xml->membro as $vNode) {
            $membro = new UsuarioBanda(
                (int) $vNode->id_usuario,
                (int) $vNode->id_banda,
                (string) $vNode->funcao
            );
            $membroCriado = $dao->create($membro);
            if ($membroCriado == false) {
                $membrosNaoCriados[] = $membro;
            } else {
                $membrosCriados[] = $membro;
            }
        }
        (new Response(
            success: true,
            message: 'Importação realizada com sucesso',
            data: [
                "membrosCriados" => $membrosCriados,
                "membrosNaoCriados" => $membrosNaoCriados,
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
        $dao = new UsuarioBandaDAO();
        $membrosCriados = [];
        $membrosNaoCriados = [];
        $primeiraLinha = true;
        while (($linhaArquivo = fgetcsv($ponteiroArquivo, 1000, ",")) !== false) {
            if ($primeiraLinha) { $primeiraLinha = false; continue; }
            if (count($linhaArquivo) < 3) continue;
            $membro = new UsuarioBanda(
                (int) $linhaArquivo[0],
                (int) $linhaArquivo[1],
                (string) $linhaArquivo[2]
            );
            $membroCriado = $dao->create($membro);
            if ($membroCriado == false) {
                $membrosNaoCriados[] = $membro;
            } else {
                $membrosCriados[] = $membro;
            }
        }
        fclose($ponteiroArquivo);
        (new Response(
            success: true,
            message: 'Importação executada com sucesso.',
            data: [
                "membrosCriados" => $membrosCriados,
                "membrosNaoCriados" => $membrosNaoCriados,
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
        if (!isset($dadosJson->membros)) {
            (new Response(
                success: false,
                message: 'Dados de vínculos não encontrados no JSON',
                httpCode: 400
            ))->send();
            exit();
        }
        $dao = new UsuarioBandaDAO();
        $membrosCriados = [];
        $membrosNaoCriados = [];
        foreach ($dadosJson->membros as $vNode) {
            $membro = new UsuarioBanda(
                (int) $vNode->id_usuario,
                (int) $vNode->id_banda,
                (string) $vNode->funcao
            );
            $membroCriado = $dao->create($membro);
            if ($membroCriado == false) {
                $membrosNaoCriados[] = $membro;
            } else {
                $membrosCriados[] = $membro;
            }
        }
        (new Response(
            success: true,
            message: 'Importação realizada com sucesso',
            data: [
                "membrosCriados" => $membrosCriados,
                "membrosNaoCriados" => $membrosNaoCriados,
            ],
            httpCode: 200
        ))->send();
        exit();
    }
}