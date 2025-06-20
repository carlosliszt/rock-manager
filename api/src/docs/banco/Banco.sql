DROP SCHEMA IF EXISTs `rock_bands`;
CREATE SCHEMA IF NOT EXISTS `rock_bands` DEFAULT CHARACTER SET utf8;
USE `rock_bands`;

CREATE TABLE IF NOT EXISTS Banda
(
    id           INT PRIMARY KEY AUTO_INCREMENT,
    nome         VARCHAR(100) NOT NULL,
    pais_origem  VARCHAR(50),
    ano_formacao INT,
    genero       VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS Shows
(
    id               INT PRIMARY KEY AUTO_INCREMENT,
    local            VARCHAR(100) NOT NULL,
    data             DATE         NOT NULL,
    publico_estimado INT
);

CREATE TABLE IF NOT EXISTS Participacao
(
    id_banda           INT,
    id_show            INT,
    ordem_apresentacao INT,
    tempo_execucao_min INT,
    PRIMARY KEY (id_banda, id_show),
    FOREIGN KEY (id_banda) REFERENCES Banda (id),
    FOREIGN KEY (id_show) REFERENCES Shows (id)
);

CREATE TABLE IF NOT EXISTS Usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  ativo TINYINT(1) DEFAULT 1,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO Banda (id, nome, pais_origem, ano_formacao, genero)
VALUES (1, 'Slayer', 'Estados Unidos', 1981, 'Thrash Metal'),
       (2, 'Black Sabbath', 'Reino Unido', 1968, 'Heavy Metal'),
       (3, 'Alice in Chains', 'Estados Unidos', 1987, 'Grunge'),
       (4, 'Megadeth', 'Estados Unidos', 1983, 'Thrash Metal');

INSERT INTO Shows (id, local, data, publico_estimado)
VALUES (1, 'Download Festival - Inglaterra', '2023-06-10', 85000),
       (2, 'Rock in Rio - Brasil', '2022-09-02', 100000),
       (3, 'Hellfest - França', '2024-07-15', 60000);

INSERT INTO Participacao (id_banda, id_show, ordem_apresentacao, tempo_execucao_min)
VALUES (1, 1, 2, 70), -- Slayer no Download Festival
       (2, 2, 1, 80), -- Black Sabbath no Rock in Rio
       (3, 2, 3, 60), -- Alice in Chains no Rock in Rio
       (4, 3, 1, 75); -- Megadeth no Hellfest



