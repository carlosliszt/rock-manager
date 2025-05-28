<?php

require_once "api/src/models/Show.php";
require_once "api/src/db/Database.php";
require_once "api/src/utils/Logger.php";

class ShowDAO
{
    public function create(Show $show): Show
    {
        $query = 'INSERT INTO Shows (local, data, publico_estimado) VALUES (:local, :data, :publico_estimado)';
        $statement = Database::getConnection()->prepare($query);
        $statement->bindValue(':local', $show->getLocal(), PDO::PARAM_STR);
        $statement->bindValue(':data', $show->getData(), PDO::PARAM_STR);
        $statement->bindValue(':publico_estimado', $show->getPublicoEstimado(), PDO::PARAM_INT);
        $statement->execute();
        $show->setId((int) Database::getConnection()->lastInsertId());
        return $show;
    }

    public function delete(int $id): bool
    {
        $query = 'DELETE FROM Shows WHERE id = :id';
        $statement = Database::getConnection()->prepare($query);
        $statement->bindValue(':id', $id, PDO::PARAM_INT);
        $statement->execute();
        return $statement->rowCount() > 0;
    }

    public function readByPage(int $page, int $limit): array
    {
        $offset = ($page - 1) * $limit;
        $query = 'SELECT id, local, data, publico_estimado FROM Shows ORDER BY data ASC LIMIT :limit OFFSET :offset';
        $statement = Database::getConnection()->prepare($query);
        $statement->bindValue(':limit', $limit, PDO::PARAM_INT);
        $statement->bindValue(':offset', $offset, PDO::PARAM_INT);
        $statement->execute();
        $resultados = [];
        while ($linha = $statement->fetch(PDO::FETCH_OBJ)) {
            $show = new Show(
                $linha->id,
                $linha->local,
                $linha->data,
                $linha->publico_estimado
            );
            $resultados[] = $show;
        }
        return $resultados;
    }

    public function readAll(): array
    {
        $resultados = [];
        $query = 'SELECT id, local, data, publico_estimado FROM Shows ORDER BY data ASC';
        $statement = Database::getConnection()->query($query);
        while ($linha = $statement->fetch(PDO::FETCH_OBJ)) {
            $show = new Show(
                $linha->id,
                $linha->local,
                $linha->data,
                $linha->publico_estimado
            );
            $resultados[] = $show;
        }
        return $resultados;
    }

    public function readById(int $id): ?Show
    {
        $query = 'SELECT id, local, data, publico_estimado FROM Shows WHERE id = :id';
        $statement = Database::getConnection()->prepare($query);
        $statement->bindValue(':id', $id, PDO::PARAM_INT);
        $statement->execute();
        $linha = $statement->fetch(PDO::FETCH_OBJ);
        if (!$linha) {
            return null;
        }
        return new Show(
            $linha->id,
            $linha->local,
            $linha->data,
            $linha->publico_estimado
        );
    }

    public function update(Show $show): bool
    {
        $query = 'UPDATE Shows SET local = :local, data = :data, publico_estimado = :publico_estimado WHERE id = :id';
        $statement = Database::getConnection()->prepare($query);
        $statement->bindValue(':local', $show->getLocal(), PDO::PARAM_STR);
        $statement->bindValue(':data', $show->getData(), PDO::PARAM_STR);
        $statement->bindValue(':publico_estimado', $show->getPublicoEstimado(), PDO::PARAM_INT);
        $statement->bindValue(':id', $show->getId(), PDO::PARAM_INT);
        $statement->execute();
        return $statement->rowCount() > 0;
    }

    public function readByLocalData($local, $data): ?Show
    {
        $query = 'SELECT id, local, data, publico_estimado FROM Shows WHERE local = :local AND data = :data LIMIT 1';
        $statement = Database::getConnection()->prepare($query);
        $statement->bindValue(':local', $local, PDO::PARAM_STR);
        $statement->bindValue(':data', $data, PDO::PARAM_STR);
        $statement->execute();
        $linha = $statement->fetch(PDO::FETCH_OBJ);
        if (!$linha) {
            return null;
        }
        return new Show(
            $linha->id,
            $linha->local,
            $linha->data,
            $linha->publico_estimado
        );
    }
}