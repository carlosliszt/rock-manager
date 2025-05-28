<?php

class Participacao implements \JsonSerializable
{
    private int $id_banda;
    private int $id_show;
    private int $ordem_apresentacao;
    private int $tempo_execucao_min;

    public function __construct(
        int $id_banda,
        int $id_show,
        int $ordem_apresentacao,
        int $tempo_execucao_min
    ) {
        $this->id_banda = $id_banda;
        $this->id_show = $id_show;
        $this->ordem_apresentacao = $ordem_apresentacao;
        $this->tempo_execucao_min = $tempo_execucao_min;
    }

    public function getIdBanda(): int
    {
        return $this->id_banda;
    }

    public function setIdBanda(int $id_banda): void
    {
        $this->id_banda = $id_banda;
    }

    public function getIdShow(): int
    {
        return $this->id_show;
    }

    public function setIdShow(int $id_show): void
    {
        $this->id_show = $id_show;
    }

    public function getOrdemApresentacao(): int
    {
        return $this->ordem_apresentacao;
    }

    public function setOrdemApresentacao(int $ordem_apresentacao): void
    {
        $this->ordem_apresentacao = $ordem_apresentacao;
    }

    public function getTempoExecucaoMin(): int
    {
        return $this->tempo_execucao_min;
    }

    public function setTempoExecucaoMin(int $tempo_execucao_min): void
    {
        $this->tempo_execucao_min = $tempo_execucao_min;
    }

    public function jsonSerialize(): mixed
    {
        return [
            'id_banda' => $this->id_banda,
            'id_show' => $this->id_show,
            'ordem_apresentacao' => $this->ordem_apresentacao,
            'tempo_execucao_min' => $this->tempo_execucao_min,
        ];
    }
}