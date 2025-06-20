<?php

class Show implements \JsonSerializable
{

    public function __construct(
        private int $id,
        private string $local,
        private string $data,
        private ?int $publico_estimado = null
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

    public function getLocal(): string
    {
        return $this->local;
    }

    public function setLocal(string $local): void
    {
        $this->local = $local;
    }

    public function getData(): string
    {
        return $this->data;
    }

    public function setData(string $data): void
    {
        $this->data = $data;
    }

    public function getPublicoEstimado(): ?int
    {
        return $this->publico_estimado;
    }

    public function setPublicoEstimado(?int $publico_estimado): void
    {
        $this->publico_estimado = $publico_estimado;
    }

    public function jsonSerialize(): mixed
    {
        return [
            'id' => $this->id,
            'local' => $this->local,
            'data' => $this->data,
            'publico_estimado' => $this->publico_estimado,
        ];
    }
}