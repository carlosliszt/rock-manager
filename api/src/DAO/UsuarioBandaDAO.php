<?php

require_once 'api/src/models/UsuarioBanda.php';
require_once 'api/src/db/Database.php';
require_once 'api/src/utils/Logger.php';

class UsuarioBandaDAO
{
    public function create(UsuarioBanda $usuarioBanda): UsuarioBanda
    {
        $query = 'INSERT INTO UsuarioBanda (id_usuario, id_banda, funcao) VALUES (:id_usuario, :id_banda, :funcao)';
        $stmt = Database::getConnection()->prepare($query);
        $stmt->bindValue(':id_usuario', $usuarioBanda->getIdUsuario(), PDO::PARAM_INT);
        $stmt->bindValue(':id_banda', $usuarioBanda->getIdBanda(), PDO::PARAM_INT);
        $stmt->bindValue(':funcao', $usuarioBanda->getFuncao(), PDO::PARAM_STR);
        $stmt->execute();
        return $usuarioBanda;
    }

    public function delete(int $id_usuario, int $id_banda): bool
    {
        $query = 'DELETE FROM UsuarioBanda WHERE id_usuario = :id_usuario AND id_banda = :id_banda';
        $stmt = Database::getConnection()->prepare($query);
        $stmt->bindValue(':id_usuario', $id_usuario, PDO::PARAM_INT);
        $stmt->bindValue(':id_banda', $id_banda, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    public function deleteOrfas(): int
    {
        $query = 'DELETE FROM UsuarioBanda WHERE id_banda NOT IN (SELECT id FROM Banda) OR id_usuario NOT IN (SELECT id FROM Usuarios)';
        $stmt = Database::getConnection()->prepare($query);
        $stmt->execute();
        return $stmt->rowCount();
    }

    public function readAll(): array
    {
        $sql = "SELECT ub.id_usuario, u.username AS nome_usuario, ub.id_banda, b.nome AS nome_banda, ub.funcao
            FROM UsuarioBanda ub
            JOIN Usuarios u ON ub.id_usuario = u.id
            JOIN Banda b ON ub.id_banda = b.id";
        $stmt = Database::getConnection()->query($sql);
        $result = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $vinculo = new UsuarioBanda(
                $row['id_usuario'],
                $row['id_banda'],
                $row['funcao']
            );
            $vinculo->setNomeUsuario($row['nome_usuario']);
            $vinculo->setNomeBanda($row['nome_banda']);
            $result[] = $vinculo;
        }
        return $result;
    }

    public function readById(int $id_usuario, int $id_banda): ?UsuarioBanda
    {
        $sql = "SELECT ub.id_usuario, u.username AS nome_usuario, ub.id_banda, b.nome AS nome_banda, ub.funcao
            FROM UsuarioBanda ub
            JOIN Usuarios u ON ub.id_usuario = u.id
            JOIN Banda b ON ub.id_banda = b.id
            WHERE ub.id_usuario = ? AND ub.id_banda = ?";
        $stmt = Database::getConnection()->prepare($sql);
        $stmt->execute([$id_usuario, $id_banda]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row) {
            $vinculo = new UsuarioBanda(
                $row['id_usuario'],
                $row['id_banda'],
                $row['funcao']
            );
            $vinculo->setNomeUsuario($row['nome_usuario']);
            $vinculo->setNomeBanda($row['nome_banda']);
            return $vinculo;
        }
        return null;
    }

    public function readByPage(int $page, int $limit): array
    {
        $offset = ($page - 1) * $limit;
        $sql = "SELECT ub.id_usuario, u.username AS nome_usuario, ub.id_banda, b.nome AS nome_banda, ub.funcao
            FROM UsuarioBanda ub
            JOIN Usuarios u ON ub.id_usuario = u.id
            JOIN Banda b ON ub.id_banda = b.id
            LIMIT ? OFFSET ?";
        $stmt = Database::getConnection()->prepare($sql);
        $stmt->bindValue(1, $limit, PDO::PARAM_INT);
        $stmt->bindValue(2, $offset, PDO::PARAM_INT);
        $stmt->execute();
        $result = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $vinculo = new UsuarioBanda(
                $row['id_usuario'],
                $row['id_banda'],
                $row['funcao']
            );
            $vinculo->setNomeUsuario($row['nome_usuario']);
            $vinculo->setNomeBanda($row['nome_banda']);
            $result[] = $vinculo;
        }
        return $result;
    }

    public function readByUsuario(int $id_usuario): array
    {
        $query = 'SELECT id_usuario, id_banda, funcao FROM UsuarioBanda WHERE id_usuario = :id_usuario';
        $stmt = Database::getConnection()->prepare($query);
        $stmt->bindValue(':id_usuario', $id_usuario, PDO::PARAM_INT);
        $stmt->execute();
        $resultados = [];
        while ($linha = $stmt->fetch(PDO::FETCH_OBJ)) {
            $resultados[] = new UsuarioBanda(
                $linha->id_usuario,
                $linha->id_banda,
                $linha->funcao
            );
        }
        return $resultados;
    }

    public function update(UsuarioBanda $usuarioBanda): bool
    {
        $query = 'UPDATE UsuarioBanda SET funcao = :funcao WHERE id_usuario = :id_usuario AND id_banda = :id_banda';
        $stmt = Database::getConnection()->prepare($query);
        $stmt->bindValue(':funcao', $usuarioBanda->getFuncao(), PDO::PARAM_STR);
        $stmt->bindValue(':id_usuario', $usuarioBanda->getIdUsuario(), PDO::PARAM_INT);
        $stmt->bindValue(':id_banda', $usuarioBanda->getIdBanda(), PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    public function existeVinculo(int $id_usuario, int $id_banda): bool
    {
        $query = 'SELECT 1 FROM UsuarioBanda WHERE id_usuario = :id_usuario AND id_banda = :id_banda';
        $stmt = Database::getConnection()->prepare($query);
        $stmt->bindValue(':id_usuario', $id_usuario, PDO::PARAM_INT);
        $stmt->bindValue(':id_banda', $id_banda, PDO::PARAM_INT);
        $stmt->execute();
        return (bool) $stmt->fetchColumn();
    }
}