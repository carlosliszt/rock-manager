<?php

class Usuario implements \JsonSerializable
{
    public function __construct(
        private int $id,
        private string $username,
        private string $email,
        private string $password_hash,
        private string $role = 'user',
        private int $ativo = 1,
        private string $criado_em = ''
    ) {
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function setId(int $id): void
    {
        $this->id = $id;
    }

    public function getUsername(): string
    {
        return $this->username;
    }

    public function setUsername(string $username): void
    {
        $this->username = $username;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function setEmail(string $email): void
    {
        $this->email = $email;
    }

    public function getPasswordHash(): string
    {
        return $this->password_hash;
    }

    public function setPasswordHash(string $password_hash): void
    {
        $this->password_hash = $password_hash;
    }

    public function getRole(): string
    {
        return $this->role;
    }

    public function setRole(string $role): void
    {
        $this->role = $role;
    }

    public function getAtivo(): int
    {
        return $this->ativo;
    }

    public function setAtivo(int $ativo): void
    {
        $this->ativo = $ativo;
    }

    public function getCriadoEm(): string
    {
        return $this->criado_em;
    }

    public function setCriadoEm(string $criado_em): void
    {
        $this->criado_em = $criado_em;
    }

    public function jsonSerialize(): mixed
    {
        return [
            'id' => $this->id,
            'username' => $this->username,
            'email' => $this->email,
            'password_hash' => $this->password_hash,
            'role' => $this->role,
            'ativo' => $this->ativo,
            'criado_em' => $this->criado_em,
        ];
    }
}