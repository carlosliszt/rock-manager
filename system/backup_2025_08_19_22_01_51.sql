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
INSERT INTO `banda` (`id`, `nome`, `pais_origem`, `ano_formacao`, `genero`) VALUES ('5', 'Queen', 'Reino Unido', '1970', 'Rock');


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


CREATE TABLE `usuariobanda` (
  `id_usuario` int NOT NULL,
  `id_banda` int NOT NULL,
  `funcao` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_usuario`,`id_banda`),
  KEY `id_banda` (`id_banda`),
  CONSTRAINT `usuariobanda_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `usuariobanda_ibfk_2` FOREIGN KEY (`id_banda`) REFERENCES `banda` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('1', '1', 'musician');


CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` varchar(50) DEFAULT 'user',
  `ativo` tinyint(1) DEFAULT '1',
  `criado_em` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;

INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('1', 'carlos', 'carlos@rock.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'user', '1', '2025-06-23 04:53:30');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('2', 'teste', 'teste@rock.com', '$2y$10$8kv7R4Rz6HOyd1.Zfj3/7.svgho8qh3suvMP9TENzhEoNPC7Xrjoq', 'user', '1', '2025-06-23 04:53:50');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('3', 'admin', 'admin@rock.com', '$2y$10$21ar0ov/SCP81.UQGZGLX.LNJh/hlRRlff7qoLitM4mxCwzzuD19S', 'admin', '1', '2025-06-23 04:57:21');


CREATE TABLE `usuarios_discord` (
  `id` int NOT NULL AUTO_INCREMENT,
  `discord_id` varchar(50) NOT NULL,
  `username` varchar(100) DEFAULT NULL,
  `avatar` varchar(200) DEFAULT NULL,
  `access_token` varchar(200) DEFAULT NULL,
  `refresh_token` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `discord_id` (`discord_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;



