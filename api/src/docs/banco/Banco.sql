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
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb3;

INSERT INTO `banda` (`id`, `nome`, `pais_origem`, `ano_formacao`, `genero`) VALUES ('1', 'Slayer', 'Estados Unidos', '1981', 'Thrash Metal');
INSERT INTO `banda` (`id`, `nome`, `pais_origem`, `ano_formacao`, `genero`) VALUES ('2', 'Black Sabbath', 'Reino Unido', '1968', 'Heavy Metal');
INSERT INTO `banda` (`id`, `nome`, `pais_origem`, `ano_formacao`, `genero`) VALUES ('3', 'Alice in Chains', 'Estados Unidos', '1987', 'Grunge');
INSERT INTO `banda` (`id`, `nome`, `pais_origem`, `ano_formacao`, `genero`) VALUES ('4', 'Megadeth', 'Estados Unidos', '1983', 'Thrash Metal');
INSERT INTO `banda` (`id`, `nome`, `pais_origem`, `ano_formacao`, `genero`) VALUES ('5', 'Queen', 'Reino Unido', '1970', 'Rock');
INSERT INTO `banda` (`id`, `nome`, `pais_origem`, `ano_formacao`, `genero`) VALUES ('6', 'Skank', 'Brasil', '1991', 'Rock');
INSERT INTO `banda` (`id`, `nome`, `pais_origem`, `ano_formacao`, `genero`) VALUES ('7', 'Iron Maiden', 'Reino Unido', '1975', 'Heavy Metal');
INSERT INTO `banda` (`id`, `nome`, `pais_origem`, `ano_formacao`, `genero`) VALUES ('8', 'Metallica', 'Estados Unidos', '1981', 'Thrash Metal');
INSERT INTO `banda` (`id`, `nome`, `pais_origem`, `ano_formacao`, `genero`) VALUES ('9', 'Pearl Jam', 'Estados Unidos', '1990', 'Grunge');
INSERT INTO `banda` (`id`, `nome`, `pais_origem`, `ano_formacao`, `genero`) VALUES ('10', 'Foo Fighters', 'Estados Unidos', '1994', 'Rock');
INSERT INTO `banda` (`id`, `nome`, `pais_origem`, `ano_formacao`, `genero`) VALUES ('11', 'Sepultura', 'Brasil', '1984', 'Metal');
INSERT INTO `banda` (`id`, `nome`, `pais_origem`, `ano_formacao`, `genero`) VALUES ('12', 'Pink Floyd', 'Reino Unido', '1965', 'Progressive Rock');
INSERT INTO `banda` (`id`, `nome`, `pais_origem`, `ano_formacao`, `genero`) VALUES ('13', 'Led Zeppelin', 'Reino Unido', '1968', 'Hard Rock');
INSERT INTO `banda` (`id`, `nome`, `pais_origem`, `ano_formacao`, `genero`) VALUES ('14', 'The Beatles', 'Reino Unido', '1960', 'Rock');
INSERT INTO `banda` (`id`, `nome`, `pais_origem`, `ano_formacao`, `genero`) VALUES ('15', 'AC/DC', 'Austrália', '1973', 'Hard Rock');
INSERT INTO `banda` (`id`, `nome`, `pais_origem`, `ano_formacao`, `genero`) VALUES ('16', 'The Rolling Stones', 'Reino Unido', '1962', 'Rock');
INSERT INTO `banda` (`id`, `nome`, `pais_origem`, `ano_formacao`, `genero`) VALUES ('17', 'Red Hot Chili Peppers', 'Estados Unidos', '1983', 'Funk Rock');
INSERT INTO `banda` (`id`, `nome`, `pais_origem`, `ano_formacao`, `genero`) VALUES ('18', 'Rush', 'Canadá', '1968', 'Progressive Rock');
INSERT INTO `banda` (`id`, `nome`, `pais_origem`, `ano_formacao`, `genero`) VALUES ('19', 'The Who', 'Reino Unido', '1964', 'Rock');
INSERT INTO `banda` (`id`, `nome`, `pais_origem`, `ano_formacao`, `genero`) VALUES ('20', 'Motörhead', 'Reino Unido', '1975', 'Heavy Metal');
INSERT INTO `banda` (`id`, `nome`, `pais_origem`, `ano_formacao`, `genero`) VALUES ('21', 'Rammstein', 'Alemanha', '1994', 'Industrial Metal');
INSERT INTO `banda` (`id`, `nome`, `pais_origem`, `ano_formacao`, `genero`) VALUES ('22', 'System of a Down', 'Estados Unidos', '1994', 'Alternative Metal');
INSERT INTO `banda` (`id`, `nome`, `pais_origem`, `ano_formacao`, `genero`) VALUES ('23', 'Dream Theater', 'Estados Unidos', '1985', 'Progressive Metal');
INSERT INTO `banda` (`id`, `nome`, `pais_origem`, `ano_formacao`, `genero`) VALUES ('24', 'U2', 'Irlanda', '1976', 'Rock');
INSERT INTO `banda` (`id`, `nome`, `pais_origem`, `ano_formacao`, `genero`) VALUES ('25', 'Kiss', 'Estados Unidos', '1973', 'Hard Rock');
INSERT INTO `banda` (`id`, `nome`, `pais_origem`, `ano_formacao`, `genero`) VALUES ('26', 'Linkin Park', 'Estados Unidos', '1996', 'Nu Metal');


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
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('7', '1', '3', '90');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('7', '6', '1', '85');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('7', '8', '2', '80');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('8', '2', '1', '95');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('8', '7', '2', '100');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('8', '9', '3', '90');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('9', '3', '2', '70');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('9', '8', '1', '75');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('9', '10', '2', '80');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('10', '4', '2', '90');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('10', '9', '3', '100');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('10', '11', '1', '85');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('11', '5', '1', '80');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('11', '10', '2', '70');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('11', '12', '3', '70');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('12', '2', '3', '100');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('12', '11', '1', '120');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('12', '13', '2', '110');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('13', '1', '1', '100');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('13', '12', '2', '110');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('13', '14', '3', '105');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('14', '3', '1', '110');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('14', '13', '3', '100');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('14', '15', '2', '120');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('15', '4', '3', '95');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('15', '14', '2', '80');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('15', '16', '2', '90');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('16', '5', '2', '110');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('16', '15', '1', '105');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('16', '17', '3', '115');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('17', '1', '2', '85');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('17', '16', '3', '80');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('17', '18', '2', '80');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('18', '2', '1', '95');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('18', '17', '2', '100');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('18', '19', '3', '90');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('19', '3', '2', '70');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('19', '18', '1', '75');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('19', '20', '2', '80');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('20', '4', '1', '85');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('20', '19', '2', '100');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('20', '21', '2', '90');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('21', '5', '2', '90');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('21', '20', '3', '80');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('21', '22', '1', '85');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('22', '1', '3', '110');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('22', '21', '1', '120');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('22', '23', '2', '125');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('23', '3', '1', '115');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('23', '22', '2', '110');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('23', '24', '3', '110');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('24', '2', '2', '110');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('24', '23', '3', '100');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('24', '25', '1', '105');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('25', '4', '2', '100');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('25', '6', '3', '80');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('25', '24', '1', '90');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('26', '5', '1', '110');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('26', '7', '3', '125');
INSERT INTO `participacao` (`id_banda`, `id_show`, `ordem_apresentacao`, `tempo_execucao_min`) VALUES ('26', '25', '2', '120');


CREATE TABLE `shows` (
                         `id` int NOT NULL AUTO_INCREMENT,
                         `local` varchar(100) NOT NULL,
                         `data` date NOT NULL,
                         `publico_estimado` int DEFAULT NULL,
                         PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb3;

INSERT INTO `shows` (`id`, `local`, `data`, `publico_estimado`) VALUES ('1', 'Download Festival - Inglaterra', '2023-06-10', '85000');
INSERT INTO `shows` (`id`, `local`, `data`, `publico_estimado`) VALUES ('2', 'Rock in Rio - Brasil', '2022-09-02', '100000');
INSERT INTO `shows` (`id`, `local`, `data`, `publico_estimado`) VALUES ('3', 'Hellfest - França', '2024-07-15', '60000');
INSERT INTO `shows` (`id`, `local`, `data`, `publico_estimado`) VALUES ('4', 'Allianz Park', '2025-08-30', '80000');
INSERT INTO `shows` (`id`, `local`, `data`, `publico_estimado`) VALUES ('5', 'Martins Pereira', '2025-08-21', '10000');
INSERT INTO `shows` (`id`, `local`, `data`, `publico_estimado`) VALUES ('6', 'Wacken Open Air - Alemanha', '2025-09-05', '75000');
INSERT INTO `shows` (`id`, `local`, `data`, `publico_estimado`) VALUES ('7', 'Madison Square Garden - EUA', '2025-09-10', '20000');
INSERT INTO `shows` (`id`, `local`, `data`, `publico_estimado`) VALUES ('8', 'Estádio do Morumbi - Brasil', '2025-09-15', '65000');
INSERT INTO `shows` (`id`, `local`, `data`, `publico_estimado`) VALUES ('9', 'Lollapalooza - Brasil', '2025-09-20', '90000');
INSERT INTO `shows` (`id`, `local`, `data`, `publico_estimado`) VALUES ('10', 'Teatro Apollo - NY', '2025-09-25', '5000');
INSERT INTO `shows` (`id`, `local`, `data`, `publico_estimado`) VALUES ('11', 'Rock am Ring - Alemanha', '2025-09-30', '80000');
INSERT INTO `shows` (`id`, `local`, `data`, `publico_estimado`) VALUES ('12', 'Reading Festival - Inglaterra', '2025-10-05', '85000');
INSERT INTO `shows` (`id`, `local`, `data`, `publico_estimado`) VALUES ('13', 'Estádio Nacional - Chile', '2025-10-10', '70000');
INSERT INTO `shows` (`id`, `local`, `data`, `publico_estimado`) VALUES ('14', 'Palacio de los Deportes - México', '2025-10-15', '22000');
INSERT INTO `shows` (`id`, `local`, `data`, `publico_estimado`) VALUES ('15', 'Tokyo Dome - Japão', '2025-10-20', '55000');
INSERT INTO `shows` (`id`, `local`, `data`, `publico_estimado`) VALUES ('16', 'Sydney Opera House - Austrália', '2025-10-25', '12000');
INSERT INTO `shows` (`id`, `local`, `data`, `publico_estimado`) VALUES ('17', 'Estádio Nacional - Portugal', '2025-10-30', '60000');
INSERT INTO `shows` (`id`, `local`, `data`, `publico_estimado`) VALUES ('18', 'Maracanã - Brasil', '2025-11-05', '90000');
INSERT INTO `shows` (`id`, `local`, `data`, `publico_estimado`) VALUES ('19', 'Estádio do Dragão - Portugal', '2025-11-10', '50000');
INSERT INTO `shows` (`id`, `local`, `data`, `publico_estimado`) VALUES ('20', 'Estádio Monumental - Argentina', '2025-11-15', '70000');
INSERT INTO `shows` (`id`, `local`, `data`, `publico_estimado`) VALUES ('21', 'Estádio Centenario - Uruguai', '2025-11-20', '60000');
INSERT INTO `shows` (`id`, `local`, `data`, `publico_estimado`) VALUES ('22', 'Estádio Olímpico - Espanha', '2025-11-25', '68000');
INSERT INTO `shows` (`id`, `local`, `data`, `publico_estimado`) VALUES ('23', 'Allianz Arena - Alemanha', '2025-12-01', '75000');
INSERT INTO `shows` (`id`, `local`, `data`, `publico_estimado`) VALUES ('24', 'Estádio Olímpico - Itália', '2025-12-05', '70000');
INSERT INTO `shows` (`id`, `local`, `data`, `publico_estimado`) VALUES ('25', 'Stade de France - França', '2025-12-10', '80000');


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
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('29', '7', 'vocalista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('30', '7', 'baixista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('31', '7', 'guitarrista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('32', '7', 'baterista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('33', '8', 'vocalista/guitarrista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('34', '8', 'baterista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('35', '8', 'guitarrista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('36', '8', 'baixista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('37', '9', 'vocalista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('38', '9', 'guitarrista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('39', '9', 'baixista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('40', '9', 'baterista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('41', '10', 'vocalista/guitarrista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('42', '10', 'baterista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('43', '10', 'baixista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('44', '10', 'guitarrista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('45', '11', 'guitarrista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('46', '11', 'vocalista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('47', '11', 'baixista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('48', '11', 'baterista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('49', '12', 'guitarrista/vocalista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('50', '12', 'baixista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('51', '12', 'tecladista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('52', '12', 'baterista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('53', '13', 'vocalista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('54', '13', 'guitarrista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('55', '13', 'baixista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('56', '13', 'baterista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('57', '14', 'vocalista/guitarrista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('58', '14', 'baixista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('59', '14', 'guitarrista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('60', '14', 'baterista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('61', '15', 'vocalista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('62', '15', 'guitarrista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('63', '15', 'baixista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('64', '15', 'baterista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('65', '16', 'vocalista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('66', '16', 'guitarrista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('67', '16', 'baterista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('68', '16', 'baixista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('69', '17', 'vocalista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('70', '17', 'baixista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('71', '17', 'guitarrista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('72', '17', 'baterista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('73', '18', 'vocalista/baixista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('74', '18', 'guitarrista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('75', '18', 'baterista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('76', '18', 'guitarrista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('77', '19', 'vocalista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('78', '19', 'guitarrista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('79', '19', 'baixista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('80', '19', 'baterista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('81', '20', 'vocalista/baixista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('82', '20', 'guitarrista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('83', '20', 'baterista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('84', '20', 'guitarrista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('85', '21', 'vocalista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('86', '21', 'guitarrista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('87', '21', 'guitarrista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('88', '21', 'tecladista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('89', '22', 'vocalista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('90', '22', 'guitarrista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('91', '22', 'baixista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('92', '22', 'baterista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('93', '23', 'vocalista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('94', '23', 'guitarrista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('95', '23', 'baixista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('96', '23', 'baterista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('97', '24', 'vocalista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('98', '24', 'guitarrista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('99', '24', 'baixista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('100', '24', 'baterista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('101', '25', 'vocalista/guitarrista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('102', '25', 'baixista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('103', '25', 'guitarrista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('104', '25', 'baterista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('105', '26', 'vocalista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('106', '26', 'guitarrista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('107', '26', 'baixista');
INSERT INTO `usuariobanda` (`id_usuario`, `id_banda`, `funcao`) VALUES ('108', '26', 'baterista');


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
) ENGINE=InnoDB AUTO_INCREMENT=109 DEFAULT CHARSET=utf8mb3;

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
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('29', 'brucedickinson', 'bruce@ironmaiden.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('30', 'steveharris', 'steve@ironmaiden.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('31', 'davesmith', 'dave@ironmaiden.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('32', 'nickomcbrain', 'nicko@ironmaiden.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('33', 'jameshetfield', 'james@metallica.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('34', 'larsulrich', 'lars@metallica.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('35', 'kirkhammett', 'kirk@metallica.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('36', 'robtrujillo', 'rob@metallica.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('37', 'eddievedder', 'eddie@pearljam.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('38', 'mikemccready', 'mike@pearljam.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('39', 'jeffament', 'jeff@pearljam.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('40', 'mattcameron', 'matt@pearljam.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('41', 'davegrohl', 'dave@foofighters.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('42', 'taylorhawkins', 'taylor@foofighters.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('43', 'nateshiflett', 'nate@foofighters.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('44', 'patgorman', 'pat@foofighters.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('45', 'andreas', 'andreas@sepultura.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('46', 'derrick', 'derrick@sepultura.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('47', 'paulo', 'paulo@sepultura.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('48', 'eloy', 'eloy@sepultura.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('49', 'davidgilmour', 'david@pinkfloyd.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('50', 'rogerwaters', 'roger@pinkfloyd.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('51', 'richardwright', 'richard@pinkfloyd.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('52', 'nickmason', 'nick@pinkfloyd.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('53', 'robertplant', 'robert@zeppelin.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('54', 'jimmypage', 'jimmy@zeppelin.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('55', 'johnpauljones', 'johnpaul@zeppelin.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('56', 'johnbonham', 'john@zeppelin.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('57', 'johndoe', 'john@beatles.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('58', 'paulmccartney', 'paul@beatles.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('59', 'georgeharrison', 'george@beatles.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('60', 'ringostarr', 'ringo@beatles.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('61', 'briancjohnson', 'brian@acdc.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('62', 'angusyoung', 'angus@acdc.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('63', 'cliffwilliams', 'cliff@acdc.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('64', 'philrudd', 'phil@acdc.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('65', 'mickjagger', 'mick@rollingstones.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('66', 'keithrichards', 'keith@rollingstones.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('67', 'charliewatts', 'charlie@rollingstones.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('68', 'ronniewood', 'ronnie@rollingstones.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('69', 'anthonykiedis', 'anthony@rhcp.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('70', 'flea', 'flea@rhcp.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('71', 'johnfrusciante', 'john@rhcp.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('72', 'chadsmith', 'chad@rhcp.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('73', 'geddylee', 'geddy@rush.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('74', 'alexlifeson', 'alex@rush.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('75', 'neilpeart', 'neil@rush.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('76', 'johnrutsey', 'john@rush.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('77', 'rogerdaltrey', 'roger@thewho.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('78', 'petetownshend', 'pete@thewho.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('79', 'johnentwistle', 'john@thewho.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('80', 'keithmoon', 'keith@thewho.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('81', 'lemmy', 'lemmy@motorhead.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('82', 'philcampbell', 'phil@motorhead.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('83', 'mikedeego', 'mike@motorhead.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('84', 'eddieclarke', 'eddie@motorhead.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('85', 'tilllindemann', 'till@rammstein.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('86', 'richardkruspe', 'richard@rammstein.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('87', 'paullanders', 'paul@rammstein.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('88', 'flakelorenz', 'flake@rammstein.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('89', 'serjtankian', 'serj@soad.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('90', 'daronmalakian', 'daron@soad.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('91', 'shavoodadjian', 'shavo@soad.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('92', 'johndolmayan', 'john@soad.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('93', 'jameslab', 'james@dreamtheater.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('94', 'johnguitar', 'johnp@dreamtheater.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('95', 'johnmyung', 'johnm@dreamtheater.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('96', 'mikemangini', 'mike@dreamtheater.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('97', 'bono', 'bono@u2.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('98', 'theedge', 'edge@u2.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('99', 'adamclayton', 'adam@u2.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('100', 'larrymullen', 'larry@u2.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('101', 'paulstanley', 'paul@kiss.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('102', 'genesis', 'gene@kiss.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('103', 'acefrehley', 'ace@kiss.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('104', 'peterg', 'peter@kiss.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('105', 'chester', 'chester@linkinpark.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('106', 'mike', 'mike@linkinpark.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('107', 'brad', 'brad@linkinpark.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `role`, `ativo`, `criado_em`) VALUES ('108', 'rob', 'rob@linkinpark.com', '$2y$10$9cguIjkZmUylJse1yHexCOf7amjDwuzoAhkYN8SpO8QwUGz00OdNW', 'musician', '1', '2025-08-23 19:47:26');

