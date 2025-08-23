DROP SCHEMA IF EXISTs `rock_bands`;
CREATE SCHEMA IF NOT EXISTS `rock_bands` DEFAULT CHARACTER SET utf8;
USE `rock_bands`;

CREATE TABLE `banda` (
                         `id` int NOT NULL AUTO_INCREMENT,
                         `nome` varchar(100) NOT NULL,
                         `pais_origem` varchar(50) DEFAULT NULL,
                         `ano_formacao` int DEFAULT NULL,
                         `genero` varchar(50) DEFAULT NULL,
                         PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;

INSERT INTO `banda` (`id`, `nome`, `pais_origem`, `ano_formacao`, `genero`) VALUES ('1', 'Slayer', 'Estados Unidos', '1981', 'Thrash Metal');
INSERT INTO `banda` (`id`, `nome`, `pais_origem`, `ano_formacao`, `genero`) VALUES ('2', 'Black Sabbath', 'Reino Unido', '1968', 'Heavy Metal');
INSERT INTO `banda` (`id`, `nome`, `pais_origem`, `ano_formacao`, `genero`) VALUES ('3', 'Alice in Chains', 'Estados Unidos', '1987', 'Grunge');
INSERT INTO `banda` (`id`, `nome`, `pais_origem`, `ano_formacao`, `genero`) VALUES ('4', 'Megadeth', 'Estados Unidos', '1983', 'Thrash Metal');
INSERT INTO `banda` (`id`, `nome`, `pais_origem`, `ano_formacao`, `genero`) VALUES ('5', 'Queen', 'Reino Unido', '1970', 'Rock');
INSERT INTO `banda` (`id`, `nome`, `pais_origem`, `ano_formacao`, `genero`) VALUES ('6', 'Skank', 'Brasil', '1991', 'Rock');


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
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('1', '4', '2', '60');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('2', '2', '1', '80');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('2', '4', '3', '60');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('3', '2', '3', '60');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('3', '4', '1', '60');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('4', '3', '1', '75');


CREATE TABLE `shows` (
                         `id` int NOT NULL AUTO_INCREMENT,
                         `local` varchar(100) NOT NULL,
                         `data` date NOT NULL,
                         `publico_estimado` int DEFAULT NULL,
                         PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;

INSERT INTO `shows` (`id`, `local`, `data`, `publico_estimado`) VALUES ('1', 'Download Festival - Inglaterra', '2023-06-10', '85000');
INSERT INTO `shows` (`id`, `local`, `data`, `publico_estimado`) VALUES ('2', 'Rock in Rio - Brasil', '2022-09-02', '100000');
INSERT INTO `shows` (`id`, `local`, `data`, `publico_estimado`) VALUES ('3', 'Hellfest - França', '2024-07-15', '60000');
INSERT INTO `shows` (`id`, `local`, `data`, `publico_estimado`) VALUES ('4', 'Allianz Park', '2025-08-30', '80000');
INSERT INTO `shows` (`id`, `local`, `data`, `publico_estimado`) VALUES ('5', 'Martins Pereira', '2025-08-21', '10000');


CREATE TABLE `usuariobanda` (
                                `id_usuario` int NOT NULL,
                                `id_banda` int NOT NULL,
                                `funcao` varchar(50) DEFAULT NULL,
                                PRIMARY KEY (`id_usuario`,`id_banda`),
                                KEY `id_banda` (`id_banda`),
                                CONSTRAINT `usuariobanda_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`),
                                CONSTRAINT `usuariobanda_ibfk_2` FOREIGN KEY (`id_banda`) REFERENCES `banda` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('5', '1', 'vocalista/baixista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('6', '1', 'guitarrista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('7', '1', 'guitarrista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('8', '1', 'baterista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('9', '2', 'vocalista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('10', '2', 'guitarrista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('11', '2', 'baixista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('12', '2', 'baterista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('13', '3', 'vocalista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('14', '3', 'guitarrista/vocalista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('15', '3', 'baterista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('16', '3', 'baixista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('17', '4', 'vocalista/guitarrista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('18', '4', 'baixista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('19', '4', 'baterista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('20', '4', 'guitarrista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('21', '5', 'vocalista/tecladista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('22', '5', 'guitarrista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('23', '5', 'baterista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('24', '5', 'baixista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('25', '6', 'vocalista/guitarrista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('26', '6', 'baixista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('27', '6', 'baterista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('28', '6', 'tecladista');


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
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb3;

INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('1', 'carlos', 'carlos@rock.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-06-23 04:53:30');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('2', 'teste', 'teste@rock.com', '$2y$10$8kv7R4Rz6HOyd1.Zfj3/7.svgho8qh3suvMP9TENzhEoNPC7Xrjoq', 'musician', '1', '2025-06-23 04:53:50');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('3', 'admin', 'admin@rock.com', '$2y$10$21ar0ov/SCP81.UQGZGLX.LNJh/hlRRlff7qoLitM4mxCwzzuD19S', 'admin', '1', '2025-06-23 04:57:21');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('4', 'mario', 'mario@rock.com', '$2y$10$kF77ikx26CGxOem5Lpj9uuIv218WsBWvSbZmf2gj64wS8MEXRBOBa', 'user', '1', '2025-08-19 23:56:24');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('5', 'tomaraya', 'tom@slayer.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 17:38:14');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('6', 'kerryking', 'kerry@slayer.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 17:38:14');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('7', 'hanneman', 'jeff@slayer.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 17:38:14');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('8', 'lombardo', 'dave@slayer.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 17:38:14');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('9', 'ozzy', 'ozzy@sabbath.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 17:38:14');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('10', 'iommi', 'iommi@sabbath.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 17:38:14');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('11', 'geezer', 'geezer@sabbath.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 17:38:14');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('12', 'ward', 'ward@sabbath.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 17:38:14');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('13', 'layne', 'layne@aic.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 17:38:14');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('14', 'jerrycantrell', 'jerry@aic.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 17:38:14');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('15', 'sean', 'sean@aic.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 17:38:14');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('16', 'mikeinez', 'mikeinez@aic.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 17:38:14');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('17', 'dave', 'dave@megadeth.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 17:38:14');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('18', 'ellefson', 'ellefson@megadeth.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 17:38:14');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('19', 'gar', 'gar@megadeth.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 17:38:14');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('20', 'chrispoland', 'chris@megadeth.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 17:38:14');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('21', 'freddie', 'freddie@queen.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 17:38:14');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('22', 'brianmay', 'brian@queen.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 17:38:14');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('23', 'rogertaylor', 'roger@queen.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 17:38:14');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('24', 'deacon', 'john@queen.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 17:38:14');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('25', 'samuelrosa', 'samuel@skank.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 17:38:14');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('26', 'lopes', 'lopes@skank.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 17:38:14');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('27', 'haroldo', 'haroldo@skank.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 17:38:14');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('28', 'henrique', 'henrique@skank.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 17:38:14');


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






