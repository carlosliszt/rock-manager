# 🎸 Rock Manager API

Uma API REST didática e sistema de gerenciamento web completo para bandas de rock, shows, participações e usuários. Desenvolvido para ensinar conceitos fundamentais da arquitetura REST e padrão MVC (Model-View-Controller) de forma prática e acessível.

## 📋 Índice

- [Características](#-características)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração do Banco de Dados](#-configuração-do-banco-de-dados)
- [Uso](#-uso)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [API Endpoints](#-api-endpoints)
- [Credenciais de Demonstração](#-credenciais-de-demonstração)
- [Importação/Exportação](#-importaçãoexportação)
- [Notas de Release](#-notas-de-release)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)
- [Créditos](#-créditos)

## 🌟 Características

### Funcionalidades Principais
- **Dashboard Interativo**: Visão geral com estatísticas e atividades recentes
- **Gerenciamento de Bandas**: CRUD completo com busca e filtros avançados
- **Gerenciamento de Shows**: Criação e controle de eventos musicais
- **Participações**: Vinculação de bandas aos shows com controle de ordem e duração
- **Sistema de Autenticação**: Login baseado em JWT com diferentes níveis de permissão
- **Gerenciamento de Usuários**: Listagem, ordenação, edição, ativação/desativação e exclusão de usuários via painel admin
- **Backup e Exportação Completa**: Backup SQL do banco e exportação de todos os dados em JSON
- **Importação/Exportação Completa**: Bandas, shows, participações e membros em CSV, JSON e XML
- **Limpeza de Dados**: Remoção de dados órfãos e logs antigos via painel
- **Logs do Sistema**: Visualização de logs e atividades recentes pelo painel admin

### Recursos Avançados
- **Import/Export**: Suporte para CSV, JSON e XML em todos os tipos de dados
- **Design Responsivo**: Interface adaptável para desktop, tablet e smartphone
- **API RESTful**: Endpoints bem documentados seguindo padrões REST
- **Segurança**: Autenticação JWT, validação de dados, proteção CSRF, permissões administrativas
- **Logs**: Sistema de logging para auditoria, debug e rastreio de atividades

### Tipos de Usuário
- **Admin**: Acesso total ao sistema e painel administrativo
- **Organizador**: Pode gerenciar shows e eventos
- **Músico**: Pode gerenciar bandas e participações
- **Usuário**: Acesso básico de visualização

## 🛠 Tecnologias

### Backend
- **PHP 8+**: Linguagem principal
- **MySQL/MariaDB**: Banco de dados
- **JWT (JSON Web Tokens)**: Autenticação
- **Composer**: Gerenciador de dependências
- **Apache**: Servidor web (com mod_rewrite)

### Frontend
- **HTML5/CSS3**: Estrutura e estilização
- **JavaScript (ES6+)**: Interatividade
- **Bootstrap 5**: Framework CSS responsivo
- **Bootstrap Icons**: Biblioteca de ícones

### Dependências PHP
- `firebase/php-jwt`: Manipulação de tokens JWT
- `guzzlehttp/guzzle`: Cliente HTTP para requisições

## 📋 Pré-requisitos

- **PHP 8.0+** com extensões:
  - PDO
  - PDO_MySQL
  - JSON
  - OpenSSL
- **MySQL 5.7+** ou **MariaDB 10.2+**
- **Apache 2.4+** com mod_rewrite habilitado
- **Composer** (para gerenciamento de dependências)

## 🚀 Instalação

### 1. Clone o Repositório
```bash
git clone https://github.com/carlosliszt/rock_api.git
cd rock_api
```

### 2. Instale as Dependências
```bash
composer install
```

### 3. Configure o Servidor Web
Certifique-se de que o Apache está configurado para permitir arquivos `.htaccess` e que o `mod_rewrite` está habilitado.

#### Apache Virtual Host (Exemplo)
```apache
<VirtualHost *:80>
    DocumentRoot /caminho/para/rock_api
    ServerName rock-api.local
    
    <Directory /caminho/para/rock_api>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

### 4. Configure as Permissões
```bash
# Dar permissão de escrita para logs
chmod 755 system/
chmod 644 system/log.log
```

## 🗄 Configuração do Banco de Dados

### 1. Criar o Banco de Dados
```sql
CREATE DATABASE rock_bands CHARACTER SET utf8 COLLATE utf8_general_ci;
```

### 2. Importar o Schema
```bash
mysql -u seu_usuario -p rock_bands < api/src/docs/banco/Banco.sql
```

### 3. Configurar Conexão
Edite o arquivo `api/src/db/Database.php` com suas credenciais:

```php
private const HOST = '127.0.0.1';        // Seu host MySQL
private const USER = 'seu_usuario';       // Seu usuário MySQL  
private const PASSWORD = 'sua_senha';     // Sua senha MySQL
private const DATABASE = 'rock_bands';    // Nome do banco
private const PORT = 3306;                // Porta MySQL
```

## 💻 Uso

### Acessando o Sistema
1. Acesse `http://seu-dominio/frontend/` no navegador
2. Faça login com uma das [credenciais de demonstração](#-credenciais-de-demonstração)
3. Explore o dashboard e as funcionalidades disponíveis

### Acessando a API
A API está disponível em `http://seu-dominio/api/` e aceita requisições JSON.

Exemplo de requisição:
```bash
curl -X GET "http://seu-dominio/bands" \
     -H "Authorization: Bearer SEU_JWT_TOKEN" \
     -H "Content-Type: application/json"
```

## 📁 Estrutura do Projeto

```
rock_api/
├── api/src/                    # Backend PHP
│   ├── controllers/           # Controladores MVC
│   ├── models/               # Modelos de dados
│   ├── DAO/                  # Data Access Objects
│   ├── middlewares/          # Middlewares de validação
│   ├── routes/               # Roteamento da API
│   ├── db/                   # Configuração do banco
│   ├── utils/                # Utilitários (JWT, Logger)
│   ├── http/                 # Classes de resposta HTTP
│   └── docs/                 # Documentação e SQL
├── frontend/                 # Frontend web
│   ├── index.html           # Dashboard principal
│   ├── login.html           # Página de login
│   ├── css/                 # Estilos customizados
│   ├── js/                  # Scripts JavaScript
│   └── pages/               # Páginas da aplicação
├── system/                  # Logs e backups
├── vendor/                  # Dependências do Composer
├── index.php               # Ponto de entrada da API
├── composer.json           # Configuração do Composer
└── .htaccess              # Configuração do Apache
```

## 🔌 API Endpoints

### Autenticação
- `POST /login` - Fazer login
- `POST /register` - Registrar usuário

### Usuários
- `GET /users` - Listar usuários
- `PUT /users/{id}` - Atualizar usuário
- `DELETE /users/{id}` - Excluir usuário

### Bandas
- `GET /bands` - Listar bandas
- `GET /bands/{id}` - Obter banda específica
- `POST /bands` - Criar nova banda
- `PUT /bands/{id}` - Atualizar banda
- `DELETE /bands/{id}` - Excluir banda

### Shows
- `GET /shows` - Listar shows
- `GET /shows/{id}` - Obter show específico
- `POST /shows` - Criar novo show
- `PUT /shows/{id}` - Atualizar show
- `DELETE /shows/{id}` - Excluir show

### Participações
- `GET /participacoes` - Listar participações
- `POST /participacoes` - Criar participação
- `PUT /participacoes/{id_banda}/{id_show}` - Atualizar participação
- `DELETE /participacoes/{id_banda}/{id_show}` - Excluir participação

### Membros de Banda
- `GET /bands/members` - Listar membros
- `POST /bands/members` - Adicionar membro
- `PUT /bands/members/{user}/{band}` - Atualizar membro
- `DELETE /bands/members/{user}/{band}` - Remover membro

### Import/Export
- `POST /bands/importar/{formato}` - Importar bandas (CSV/JSON/XML)
- `GET /bands/exportar/{formato}` - Exportar bandas (CSV/JSON/XML)
- `POST /shows/importar/{formato}` - Importar shows
- `GET /shows/exportar/{formato}` - Exportar shows
- `POST /participacoes/importar/{formato}` - Importar participações
- `GET /participacoes/exportar/{formato}` - Exportar participações
- `POST /bands/members/importar/{formato}` - Importar membros
- `GET /bands/members/exportar/{formato}` - Exportar membros

### Administração e Sistema
- `GET /backup` - Exportar backup SQL do banco
- `GET /export-all` - Exportar todos os dados em JSON
- `GET /sys/logs` - Visualizar logs do sistema
- `GET /sys/activity` - Visualizar atividades recentes
- `POST /sys/cleanup` - Limpar dados órfãos e logs antigos

Para documentação completa da API, acesse `/frontend/pages/docs.html` após a instalação.

## 📥📤 Importação/Exportação

O sistema suporta importação e exportação de dados em três formatos para todos os tipos:

### Formatos Suportados
- **CSV**: Compatível com Excel e planilhas
- **JSON**: Formato estruturado para desenvolvedores
- **XML**: Formato estruturado padrão

### Estruturas CSV

#### Bandas
```csv
id,nome,genero,pais_origem,ano_formacao
1,Slayer,Thrash Metal,Estados Unidos,1981
```

#### Shows  
```csv
id,local,data,publico_estimado
1,Download Festival - Inglaterra,2023-06-10,85000
```

#### Participações
```csv
id_banda,id_show,ordem_apresentacao,tempo_execucao_min
1,1,2,70
```

#### Membros
```csv
id_usuario,id_banda,funcao
2,1,Guitarrista
```

## 📝 Notas de Release

### Release 0.2 (Atual)
- Gerenciamento completo de usuários no Painel Admin: listagem, ordenação, edição, ativação/desativação e exclusão (exceto admins)
- Exportação de backup completo do banco de dados em SQL
- Exportação de todos os dados do sistema em JSON (migração/integração)
- Importação de bandas, shows, participações e membros em CSV, JSON e XML
- Limpeza de dados órfãos (participações/membros) e logs antigos via painel
- Visualização de logs do sistema e atividades recentes
- Dashboard aprimorado com estatísticas e ações rápidas
- Melhorias de segurança: validação de permissões em todas as ações administrativas
- Correções de bugs e otimizações de performance

### Release 0.1
- Primeira versão funcional do sistema de gestão musical
- Autenticação JWT (login, registro, logout) com controle básico de roles
- CRUD de Bandas, Shows e Participações
- Exportação de Bandas, Shows, Participações em CSV, JSON e XML
- Importação de Bandas em múltiplos formatos
- Dashboard mostrando usuários recentes
- Menus dinâmicos conforme autenticação e permissões
- Sistema de toasts unificado e feedback de carregamento
- Validações básicas e download de arquivos via Blob

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/super_feature_wow`)
3. Commit suas mudanças (`git commit -m 'feature super incrivel!!!!'`)
4. Push para a branch (`git push origin feature/super_feature_wow`)
5. Abra um Pull Request

### Diretrizes para Contribuição
- Siga os padrões de código existentes
- Adicione testes para novas funcionalidades
- Mantenha a documentação atualizada
- Use mensagens de commit descritivas

## 📄 Licença

Este projeto está licenciado sob a GNU General Public License (GPL) - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Créditos

### Desenvolvimento
- **Hélio Esperidião** (Conceito original) - [@helioesperidiao](https://github.com/helioesperidiao)
- **Carlos Miguel** - [@carlosliszt](https://github.com/carlosliszt)
- **Lucas Baruel** - [@LucasBaruelCestaro](https://github.com/LucasBaruelCestaro)
- **Mario Rodrigues** - [@Mario-182](https://github.com/Mario-182/)

---

⭐ Se este projeto foi útil para você, considere dar uma estrela no GitHub!

🐛 Encontrou um bug ou tem uma sugestão? [Abra uma issue](https://github.com/carlosliszt/rock_api/issues)
