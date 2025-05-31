<?php

require_once "api/src/models/Banda.php";
require_once "api/src/db/Database.php";
require_once "api/src/utils/Logger.php";

class BandaDAO
{
    public function create(Banda $banda): Banda
    {
        $query = 'INSERT INTO Banda (nome, pais_origem, ano_formacao, genero) VALUES (:nome, :pais_origem, :ano_formacao, :genero)';
        $statement = Database::getConnection()->prepare($query);
        $statement->bindValue(':nome', $banda->getNome(), PDO::PARAM_STR);
        $statement->bindValue(':pais_origem', $banda->getPaisOrigem(), PDO::PARAM_STR);
        $statement->bindValue(':ano_formacao', $banda->getAnoFormacao(), PDO::PARAM_INT);
        $statement->bindValue(':genero', $banda->getGenero(), PDO::PARAM_STR);
        $statement->execute();
        $banda->setId((int) Database::getConnection()->lastInsertId());
        return $banda;
    }

    public function delete(int $id): bool
    {
        $query = 'DELETE FROM Banda WHERE id = :id';
        $statement = Database::getConnection()->prepare($query);
        $statement->bindValue(':id', $id, PDO::PARAM_INT);
        $statement->execute();
        return $statement->rowCount() > 0;
    }

    public function readAll(bool $ordered = true): array
    {
        $resultados = [];
        $query = 'SELECT id, nome, pais_origem, ano_formacao, genero FROM Banda'.($ordered? ' ORDER BY nome ASC' : '');
        $statement = Database::getConnection()->query($query);
        while ($linha = $statement->fetch(PDO::FETCH_OBJ)) {
            $banda = new Banda(
                $linha->id,
                $linha->nome,
                $linha->pais_origem,
                $linha->ano_formacao,
                $linha->genero
            );
            $resultados[] = $banda;
        }
        return $resultados;
    }


    public function readByName(string $nome): ?Banda
    {
        $query = 'SELECT id, nome, pais_origem, ano_formacao, genero FROM Banda WHERE nome = :nome';
        $statement = Database::getConnection()->prepare($query);
        $statement->bindValue(':nome', $nome, PDO::PARAM_STR);
        $statement->execute();
        $linha = $statement->fetch(PDO::FETCH_OBJ);
        if (!$linha) {
            return null;
        }
        return new Banda(
            $linha->id,
            $linha->nome,
            $linha->pais_origem,
            $linha->ano_formacao,
            $linha->genero
        );
    }

    public function readByPage(int $page, int $limit): array
    {
        $offset = ($page - 1) * $limit;
        $query = 'SELECT id, nome, pais_origem, ano_formacao, genero FROM Banda ORDER BY nome ASC LIMIT :limit OFFSET :offset';
        $statement = Database::getConnection()->prepare($query);
        $statement->bindValue(':limit', $limit, PDO::PARAM_INT);
        $statement->bindValue(':offset', $offset, PDO::PARAM_INT);
        $statement->execute();
        $resultados = [];
        while ($linha = $statement->fetch(PDO::FETCH_OBJ)) {
            $banda = new Banda(
                $linha->id,
                $linha->nome,
                $linha->pais_origem,
                $linha->ano_formacao,
                $linha->genero
            );
            $resultados[] = $banda;
        }
        return $resultados;
    }

    public function readById(int $id): ?Banda
    {
        $query = 'SELECT id, nome, pais_origem, ano_formacao, genero FROM Banda WHERE id = :id';
        $statement = Database::getConnection()->prepare($query);
        $statement->bindValue(':id', $id, PDO::PARAM_INT);
        $statement->execute();
        $linha = $statement->fetch(PDO::FETCH_OBJ);
        if (!$linha) {
            return null;
        }
        return new Banda(
            $linha->id,
            $linha->nome,
            $linha->pais_origem,
            $linha->ano_formacao,
            $linha->genero
        );
    }

    public function update(Banda $banda): bool
    {
        $query = 'UPDATE Banda SET nome = :nome, pais_origem = :pais_origem, ano_formacao = :ano_formacao, genero = :genero WHERE id = :id';
        $statement = Database::getConnection()->prepare($query);
        $statement->bindValue(':nome', $banda->getNome(), PDO::PARAM_STR);
        $statement->bindValue(':pais_origem', $banda->getPaisOrigem(), PDO::PARAM_STR);
        $statement->bindValue(':ano_formacao', $banda->getAnoFormacao(), PDO::PARAM_INT);
        $statement->bindValue(':genero', $banda->getGenero(), PDO::PARAM_STR);
        $statement->bindValue(':id', $banda->getId(), PDO::PARAM_INT);
        $statement->execute();
        return $statement->rowCount() > 0;
    }
}