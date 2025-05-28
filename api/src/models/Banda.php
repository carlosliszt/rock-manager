<?php

class Banda implements \JsonSerializable
{
    public function __construct(
        private int $id,
        private string $nome,
        private ?string $pais_origem = null,
        private ?int $ano_formacao = null,
        private ?string $genero = null
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

    public function getNome(): string
    {
        return $this->nome;
    }

    public function setNome(string $nome): void
    {
        $this->nome = $nome;
    }

    public function getPaisOrigem(): ?string
    {
        return $this->pais_origem;
    }

    public function setPaisOrigem(?string $pais_origem): void
    {
        $this->pais_origem = $pais_origem;
    }

    public function getAnoFormacao(): ?int
    {
        return $this->ano_formacao;
    }

    public function setAnoFormacao(?int $ano_formacao): void
    {
        $this->ano_formacao = $ano_formacao;
    }

    public function getGenero(): ?string
    {
        return $this->genero;
    }

    public function setGenero(?string $genero): void
    {
        $this->genero = $genero;
    }

    public function jsonSerialize(): mixed
    {
        return [
            'id' => $this->id,
            'nome' => $this->nome,
            'pais_origem' => $this->pais_origem,
            'ano_formacao' => $this->ano_formacao,
            'genero' => $this->genero,
        ];
    }
}