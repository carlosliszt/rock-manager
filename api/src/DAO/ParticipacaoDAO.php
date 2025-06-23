<?php

require_once "api/src/models/Participacao.php";
require_once "api/src/db/Database.php";
require_once "api/src/utils/Logger.php";

class ParticipacaoDAO
{
    public function create(Participacao $participacao): Participacao
    {
        $query = 'INSERT INTO Participacao (id_banda, id_show, ordem_apresentacao, tempo_execucao_min) 
                  VALUES (:id_banda, :id_show, :ordem_apresentacao, :tempo_execucao_min)';
        $statement = Database::getConnection()->prepare($query);
        $statement->bindValue(':id_banda', $participacao->getIdBanda(), PDO::PARAM_INT);
        $statement->bindValue(':id_show', $participacao->getIdShow(), PDO::PARAM_INT);
        $statement->bindValue(':ordem_apresentacao', $participacao->getOrdemApresentacao(), PDO::PARAM_INT);
        $statement->bindValue(':tempo_execucao_min', $participacao->getTempoExecucaoMin(), PDO::PARAM_INT);
        $statement->execute();
        return $participacao;
    }

    public function delete(int $id_banda, int $id_show): bool
    {
        $query = 'DELETE FROM Participacao WHERE id_banda = :id_banda AND id_show = :id_show';
        $statement = Database::getConnection()->prepare($query);
        $statement->bindValue(':id_banda', $id_banda, PDO::PARAM_INT);
        $statement->bindValue(':id_show', $id_show, PDO::PARAM_INT);
        $statement->execute();
        return $statement->rowCount() > 0;
    }

    public function readAll(): array
    {
        $resultados = [];
        $query = 'SELECT id_banda, id_show, ordem_apresentacao, tempo_execucao_min FROM Participacao';
        $statement = Database::getConnection()->query($query);
        while ($linha = $statement->fetch(PDO::FETCH_OBJ)) {
            $participacao = new Participacao(
                $linha->id_banda,
                $linha->id_show,
                $linha->ordem_apresentacao,
                $linha->tempo_execucao_min
            );
            $resultados[] = $participacao;
        }
        return $resultados;
    }

    public function readById(int $id_banda, int $id_show): ?Participacao
    {
        $query = 'SELECT id_banda, id_show, ordem_apresentacao, tempo_execucao_min 
                  FROM Participacao WHERE id_banda = :id_banda AND id_show = :id_show';
        $statement = Database::getConnection()->prepare($query);
        $statement->bindValue(':id_banda', $id_banda, PDO::PARAM_INT);
        $statement->bindValue(':id_show', $id_show, PDO::PARAM_INT);
        $statement->execute();
        $linha = $statement->fetch(PDO::FETCH_OBJ);
        if (!$linha) {
            return null;
        }
        return new Participacao(
            $linha->id_banda,
            $linha->id_show,
            $linha->ordem_apresentacao,
            $linha->tempo_execucao_min
        );
    }

    public function readByBanda(int $id_banda): array 
    {
        $query = '
        SELECT 
            p.id_banda,
            b.nome AS nome_banda,
            p.id_show,
            s.local AS nome_show,
            p.ordem_apresentacao,
            p.tempo_execucao_min
        FROM Participacao p
        JOIN Banda b ON p.id_banda = b.id
        JOIN Shows s ON p.id_show = s.id
        WHERE p.id_banda = :id_banda
    ';
        $stmt = Database::getConnection()->prepare($query);
        $stmt->bindParam(':id_banda', $id_banda, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }

    public function readByPage(int $page, int $limit): array
    {
        $offset = ($page - 1) * $limit;
        $query = 'SELECT id_banda, id_show, ordem_apresentacao, tempo_execucao_min 
              FROM Participacao 
              ORDER BY id_show ASC, ordem_apresentacao ASC 
              LIMIT :limit OFFSET :offset';
        $statement = Database::getConnection()->prepare($query);
        $statement->bindValue(':limit', $limit, PDO::PARAM_INT);
        $statement->bindValue(':offset', $offset, PDO::PARAM_INT);
        $statement->execute();
        $resultados = [];
        while ($linha = $statement->fetch(PDO::FETCH_OBJ)) {
            $participacao = new Participacao(
                $linha->id_banda,
                $linha->id_show,
                $linha->ordem_apresentacao,
                $linha->tempo_execucao_min
            );
            $resultados[] = $participacao;
        }
        return $resultados;
    }

    public function update(Participacao $participacao): bool
    {
        $query = 'UPDATE Participacao 
                  SET ordem_apresentacao = :ordem_apresentacao, tempo_execucao_min = :tempo_execucao_min 
                  WHERE id_banda = :id_banda AND id_show = :id_show';
        $statement = Database::getConnection()->prepare($query);
        $statement->bindValue(':ordem_apresentacao', $participacao->getOrdemApresentacao(), PDO::PARAM_INT);
        $statement->bindValue(':tempo_execucao_min', $participacao->getTempoExecucaoMin(), PDO::PARAM_INT);
        $statement->bindValue(':id_banda', $participacao->getIdBanda(), PDO::PARAM_INT);
        $statement->bindValue(':id_show', $participacao->getIdShow(), PDO::PARAM_INT);
        $statement->execute();
        return $statement->rowCount() > 0;
    }
}