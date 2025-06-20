<?php

require_once 'api/src/models/Usuario.php';
require_once 'api/src/db/Database.php';

class UsuarioDAO
{
    public function create(Usuario $usuario): Usuario
    {
        $query = 'INSERT INTO Usuarios (username, email, password_hash, role, ativo, criado_em) VALUES (:username, :email, :password_hash, :role, :ativo, :criado_em)';
        $statement = Database::getConnection()->prepare($query);
        $statement->bindValue(':username', $usuario->getUsername(), PDO::PARAM_STR);
        $statement->bindValue(':email', $usuario->getEmail(), PDO::PARAM_STR);
        $statement->bindValue(':password_hash', $usuario->getPasswordHash(), PDO::PARAM_STR);
        $statement->bindValue(':role', $usuario->getRole(), PDO::PARAM_STR);
        $statement->bindValue(':ativo', $usuario->getAtivo(), PDO::PARAM_INT);
        $statement->bindValue(':criado_em', $usuario->getCriadoEm(), PDO::PARAM_STR);
        $statement->execute();
        $usuario->setId((int)Database::getConnection()->lastInsertId());
        return $usuario;
    }

    public function readById(int $id): ?Usuario
    {
        $query = 'SELECT id, username, email, role, ativo, criado_em FROM Usuarios WHERE id = :id';
        $statement = Database::getConnection()->prepare($query);
        $statement->bindValue(':id', $id, PDO::PARAM_INT);
        $statement->execute();
        $linha = $statement->fetch(PDO::FETCH_OBJ);
        if (!$linha) {
            return null;
        }
        return new Usuario(
            $linha->id,
            $linha->username,
            $linha->email,
            "",
            $linha->role,
            $linha->ativo,
            $linha->criado_em
        );
    }

    public function readAll(bool $ordered = true): array
    {
        $resultados = [];
        $query = 'SELECT id, username, email, role, ativo, criado_em FROM Usuarios' . ($ordered ? ' ORDER BY username ASC' : '');
        $statement = Database::getConnection()->query($query);
        while ($linha = $statement->fetch(PDO::FETCH_OBJ)) {
            $usuario = new Usuario(
                $linha->id,
                $linha->username,
                $linha->email,
                "",
                $linha->role,
                $linha->ativo,
                $linha->criado_em
            );
            $resultados[] = $usuario;
        }
        return $resultados;
    }

    public function readByEmail(string $email): ?Usuario
    {
        $query = 'SELECT id, username, email, role, ativo, criado_em FROM Usuarios WHERE email = :email';
        $statement = Database::getConnection()->prepare($query);
        $statement->bindValue(':email', $email, PDO::PARAM_STR);
        $statement->execute();
        $linha = $statement->fetch(PDO::FETCH_OBJ);
        if (!$linha) {
            return null;
        }
        return new Usuario(
            $linha->id,
            $linha->username,
            $linha->email,
            "",
            $linha->role,
            $linha->ativo,
            $linha->criado_em
        );
    }

    public function readByUsername(string $username): ?Usuario
    {
        $query = 'SELECT id, username, email, role, ativo, criado_em FROM Usuarios WHERE username = :username';
        $statement = Database::getConnection()->prepare($query);
        $statement->bindValue(':username', $username, PDO::PARAM_STR);
        $statement->execute();
        $linha = $statement->fetch(PDO::FETCH_OBJ);
        if (!$linha) {
            return null;
        }
        return new Usuario(
            $linha->id,
            $linha->username,
            $linha->email,
            "",
            $linha->role,
            $linha->ativo,
            $linha->criado_em
        );
    }

    public function update(Usuario $usuario): bool
    {
        $query = 'UPDATE Usuarios SET username = :username, email = :email, password_hash = :password_hash, role = :role, ativo = :ativo, criado_em = :criado_em WHERE id = :id';
        $statement = Database::getConnection()->prepare($query);
        $statement->bindValue(':username', $usuario->getUsername(), PDO::PARAM_STR);
        $statement->bindValue(':email', $usuario->getEmail(), PDO::PARAM_STR);
        $statement->bindValue(':password_hash', $usuario->getPasswordHash(), PDO::PARAM_STR);
        $statement->bindValue(':role', $usuario->getRole(), PDO::PARAM_STR);
        $statement->bindValue(':ativo', $usuario->getAtivo(), PDO::PARAM_INT);
        $statement->bindValue(':criado_em', $usuario->getCriadoEm(), PDO::PARAM_STR);
        $statement->bindValue(':id', $usuario->getId(), PDO::PARAM_INT);
        $statement->execute();
        return $statement->rowCount() > 0;
    }

    public function delete(int $id): bool
    {
        $query = 'DELETE FROM Usuarios WHERE id = :id';
        $statement = Database::getConnection()->prepare($query);
        $statement->bindValue(':id', $id, PDO::PARAM_INT);
        $statement->execute();
        return $statement->rowCount() > 0;
    }

    public function login(string $email, string $password): ?Usuario
    {
        $query = 'SELECT id, username, email, password_hash, role, ativo, criado_em 
              FROM Usuarios 
              WHERE email = :email';
        $statement = Database::getConnection()->prepare($query);
        $statement->bindValue(':email', $email, PDO::PARAM_STR);
        $statement->execute();
        $linha = $statement->fetch(PDO::FETCH_OBJ);

        if (!$linha) {
            return null;
        }

        if (!password_verify($password, $linha->password_hash)) {
            return null;
        }

        return new Usuario(
            $linha->id,
            $linha->username,
            $linha->email,
            $linha->password_hash,
            $linha->role,
            $linha->ativo,
            $linha->criado_em
        );
    }

}