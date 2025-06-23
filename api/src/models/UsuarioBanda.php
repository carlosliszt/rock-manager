<?php

class UsuarioBanda implements \JsonSerializable
{
    private int $id_usuario;
    private int $id_banda;
    private string $funcao;
    private ?string $nome_usuario = null;
    private ?string $nome_banda = null;

    public function __construct(int $id_usuario, int $id_banda, string $funcao)
    {
        $this->id_usuario = $id_usuario;
        $this->id_banda = $id_banda;
        $this->funcao = $funcao;
    }

    public function getIdUsuario(): int
    {
        return $this->id_usuario;
    }

    public function setIdUsuario(int $id_usuario): void
    {
        $this->id_usuario = $id_usuario;
    }

    public function getIdBanda(): int
    {
        return $this->id_banda;
    }

    public function setIdBanda(int $id_banda): void
    {
        $this->id_banda = $id_banda;
    }

    public function getFuncao(): string
    {
        return $this->funcao;
    }

    public function setFuncao(string $funcao): void
    {
        $this->funcao = $funcao;
    }

    public function getNomeUsuario(): ?string
    {
        return $this->nome_usuario;
    }

    public function setNomeUsuario(?string $nome_usuario): void
    {
        $this->nome_usuario = $nome_usuario;
    }

    public function getNomeBanda(): ?string
    {
        return $this->nome_banda;
    }

    public function setNomeBanda(?string $nome_banda): void
    {
        $this->nome_banda = $nome_banda;
    }

    public function jsonSerialize(): mixed
    {
        return [
            'id_usuario' => $this->id_usuario,
            'nome_usuario' => $this->nome_usuario,
            'id_banda' => $this->id_banda,
            'nome_banda' => $this->nome_banda,
            'funcao' => $this->funcao,
        ];
    }
}