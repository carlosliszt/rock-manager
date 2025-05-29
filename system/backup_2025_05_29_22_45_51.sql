CREATE TABLE `banda` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `pais_origem` varchar(50) DEFAULT NULL,
  `ano_formacao` int DEFAULT NULL,
  `genero` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;

INSERT INTO `banda` (`id`, `nome`, `pais_origem`, `ano_formacao`, `genero`) VALUES ('1', 'Slayer', 'Estados Unidos', '1981', 'Thrash Metal');
INSERT INTO `banda` (`id`, `nome`, `pais_origem`, `ano_formacao`, `genero`) VALUES ('2', 'Black Sabbath', 'Reino Unido', '1968', 'Heavy Metal');
INSERT INTO `banda` (`id`, `nome`, `pais_origem`, `ano_formacao`, `genero`) VALUES ('3', 'Alice in Chains', 'Estados Unidos', '1987', 'Grunge');
INSERT INTO `banda` (`id`, `nome`, `pais_origem`, `ano_formacao`, `genero`) VALUES ('4', 'Megadeth', 'Estados Unidos', '1983', 'Thrash Metal');


CREATE TABLE `participacao` (
  `id_banda` int NOT NULL,
  `id_show` int NOT NULL,
  `ordem_apresentacao` int DEFAULT NULL,
  `tempo_execucao_min` int DEFAULT NULL,
  PRIMARY KEY (`id_banda`,`id_show`),
  KEY `id_show` (`id_show`),
  CONSTRAINT `participacao_ibfk_1` FOREIGN KEY (`id_banda`) REFERENCES `banda` (`id`),
  CONSTRAINT `participacao_ibfk_2` FOREIGN KEY (`id_show`) REFERENCES `shows` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('1', '1', '2', '70');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('2', '2', '1', '80');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('3', '2', '3', '60');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('4', '3', '1', '75');


CREATE TABLE `shows` (
  `id` int NOT NULL AUTO_INCREMENT,
  `local` varchar(100) NOT NULL,
  `data` date NOT NULL,
  `publico_estimado` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;

INSERT INTO `shows` (`id`, `local`, `data`, `publico_estimado`) VALUES ('1', 'Download Festival - Inglaterra', '2023-06-10', '85000');
INSERT INTO `shows` (`id`, `local`, `data`, `publico_estimado`) VALUES ('2', 'Rock in Rio - Brasil', '2022-09-02', '100000');
INSERT INTO `shows` (`id`, `local`, `data`, `publico_estimado`) VALUES ('3', 'Hellfest - França', '2024-07-15', '60000');


