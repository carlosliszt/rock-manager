<?php

require_once "api/src/routes/Router.php"; // https://github.com/bramus/router
require_once "api/src/controllers/BandaController.php";
require_once "api/src/middlewares/BandaMiddleware.php";

require_once "api/src/controllers/ShowController.php";
require_once "api/src/middlewares/ShowMiddleware.php";

require_once "api/src/controllers/ParticipacaoController.php";
require_once "api/src/middlewares/ParticipacaoMiddleware.php";

require_once "api/src/middlewares/JWTMiddleware.php";

require_once "api/src/controllers/UsuarioController.php";
require_once "api/src/middlewares/UsuarioMiddleware.php";

require_once "api/src/utils/Logger.php";
require_once "api/src/utils/JWTToken.php";
require_once "api/src/http/Response.php";

class Roteador
{
    public function __construct(private Router $router = new Router())
    {
        $this->router = new Router();

        $this->setupHeaders();

        $this->setupBandaRoutes();
        $this->setupShowRoutes();
        $this->setupParticipacaoRoutes();
        $this->setupBackupRoutes();
        $this->setup404Route();
        $this->setupTestRoutes();
        $this->setupLoginRoutes();
    }

    private function setup404Route(): void
    {
        $this->router->set404(function (): void {
            header('Content-Type: application/json');
            (new Response(
                success: false,
                message: "Rota não encontrada",
                error: [
                    'code' => 'routing_error',
                    'message' => 'Rota não mapeada'
                ],
                httpCode: 404
            ))->send();
        });
    }

    private function setupHeaders(): void
    {
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
    }

    private function sendErrorResponse(Throwable $throwable, string $message): never
    {
        Logger::Log(throwable: $throwable);

        (new Response(
            success: false,
            message: $message,
            error: [
                'code' => $throwable->getCode(),
                'message' => $throwable->getMessage()
            ],
            httpCode: 500
        ))->send();
    }

    private function setupTestRoutes() : void {
        $this->router->post('/test', function (): never {

            $tokenMiddleware = new JWTMiddleware();
            $payload = $tokenMiddleware->isValidToken();

            header('Content-Type: application/json');
            $requestBody = file_get_contents("php://input");

            $token = new JWTToken();

            $tokenStr = $token->generateToken($token->stringJsonToStdClass($requestBody));

            (new Response(
                success: true,
                message: "Token gerado com sucesso",
                data: [
                    'token' => $tokenStr
                ],
                httpCode: 200
            ))->send();

            exit();
        });
    }

    private function setupLoginRoutes(): void
    {
        $this->router->post('/login', function (): never {
            try {
                $requestBody = file_get_contents("php://input");
                (new UsuarioController())->login(json_decode($requestBody));
            } catch (Throwable $throwable) {
                $this->sendErrorResponse($throwable, 'Erro ao realizar login');
            }
        });

        $this->router->post('/register', function (): never {
            try {
                $requestBody = file_get_contents("php://input");
                $usuarioMiddleware = new UsuarioMiddleware();
                $stdUsuario = $usuarioMiddleware->stringJsonToStdClass($requestBody);
                $usuarioMiddleware
                    ->isValidUsername($stdUsuario->usuario->username)
                    ->isValidEmail($stdUsuario->usuario->email)
                    ->isValidSenha($stdUsuario->usuario->senha)
                    ->hasNotUsuarioByEmail($stdUsuario->usuario->email)
                    ->hasNotUsername($stdUsuario->usuario->username);
                (new UsuarioController())->register($stdUsuario);
            } catch (Throwable $throwable) {
                $this->sendErrorResponse($throwable, 'Erro ao registrar usuário');
            }
        });

    }

    // --- Rotas de Bandas ---
    private function setupBandaRoutes(): void
    {
        $this->router->get('/bandas', function (): never {
            try {
                $bandaControl = new BandaController();
                if (isset($_GET['page']) && isset($_GET['limit'])) {
                    (new BandaMiddleware())
                        ->isValidPage($_GET['page'])
                        ->isValidLimit($_GET['limit']);
                    $bandaControl->listPaginated((int)$_GET['page'], (int)$_GET['limit']);
                } else {
                    $bandaControl->index();
                }
            } catch (Throwable $throwable) {
                $this->sendErrorResponse($throwable, 'Erro na seleção de dados');
            }
            exit();
        });

        $this->router->get('/bandas/(\d+)', function ($id): never {
            try {
                (new BandaMiddleware())->isValidId($id)->hasBandaById($id);
                (new BandaController())->show((int)$id);
            } catch (Throwable $throwable) {
                $this->sendErrorResponse($throwable, 'Erro na seleção de dados');
            }
            exit();
        });

        $this->router->post('/bandas', function (): never {
            try {

                $tokenMiddleware = new JWTMiddleware();
                $payload = $tokenMiddleware->isValidToken();

                $requestBody = file_get_contents("php://input");
                $bandaMiddleware = new BandaMiddleware();
                $stdBanda = $bandaMiddleware->stringJsonToStdClass($requestBody);
                $bandaMiddleware
                    ->isValidNome($stdBanda->banda->nome)
                    ->hasNotBandaByName($stdBanda->banda->nome);
                (new BandaController())->store($stdBanda);
            } catch (Throwable $throwable) {
                $this->sendErrorResponse($throwable, 'Erro ao inserir uma nova banda');
            }
            exit();
        });

        $this->router->put('/bandas/(\d+)', function ($id): never {
            try {

                $tokenMiddleware = new JWTMiddleware();
                $payload = $tokenMiddleware->isValidToken();

                $requestBody = file_get_contents("php://input");
                $bandaMiddleware = new BandaMiddleware();
                $stdBanda = $bandaMiddleware->stringJsonToStdClass($requestBody);
                $bandaMiddleware
                    ->isValidId($id)
                    ->isValidNome($stdBanda->banda->nome)
                    ->hasBandaById($id);
                $stdBanda->banda->id = (int)$id;
                (new BandaController())->edit($stdBanda);
            } catch (Throwable $throwable) {
                $this->sendErrorResponse($throwable, 'Erro na atualização dos dados');
            }
            exit();
        });

        $this->router->delete('/bandas/(\d+)', function ($id): never {
            try {

                $tokenMiddleware = new JWTMiddleware();
                $payload = $tokenMiddleware->isValidToken();

                (new BandaMiddleware())->isValidId($id)->hasBandaById($id);
                (new BandaController())->destroy((int)$id);
            } catch (Throwable $throwable) {
                $this->sendErrorResponse($throwable, 'Erro na exclusão de dados');
            }
            exit();
        });

        $this->router->get('/bandas/exportar/csv', fn (): never => (new BandaController())->exportCSV());
        $this->router->get('/bandas/exportar/json', fn (): never => (new BandaController())->exportJSON());
        $this->router->get('/bandas/exportar/xml', fn (): never => (new BandaController())->exportXML());
        $this->router->post('/bandas/importar/csv', fn (): never => (new BandaController())->importCSV($_FILES['csv']));
        $this->router->post('/bandas/importar/json', fn (): never => (new BandaController())->importJson($_FILES['json']));
        $this->router->post('/bandas/importar/xml', fn (): never => (new BandaController())->importXML($_FILES['xml']));
    }

    // --- Rotas de Shows ---
    private function setupShowRoutes(): void
    {
        $this->router->get('/shows', function (): never {
            try {
                $showControl = new ShowController();
                if (isset($_GET['page']) && isset($_GET['limit'])) {
                    (new ShowMiddleware())
                        ->isValidPage($_GET['page'])
                        ->isValidLimit($_GET['limit']);
                    $showControl->listPaginated((int)$_GET['page'], (int)$_GET['limit']);
                } else {
                    $showControl->index();
                }
            } catch (Throwable $throwable) {
                $this->sendErrorResponse($throwable, 'Erro na seleção de dados');
            }
            exit();
        });

        $this->router->get('/shows/(\d+)', function ($id): never {
            try {
                (new ShowMiddleware())->isValidId($id)->hasShowById($id);
                (new ShowController())->show((int)$id);
            } catch (Throwable $throwable) {
                $this->sendErrorResponse($throwable, 'Erro na seleção de dados');
            }
            exit();
        });

        $this->router->post('/shows', function (): never {
            try {

                $tokenMiddleware = new JWTMiddleware();
                $payload = $tokenMiddleware->isValidToken();

                $requestBody = file_get_contents("php://input");
                $showMiddleware = new ShowMiddleware();
                $stdShow = $showMiddleware->stringJsonToStdClass($requestBody);
                $showMiddleware
                    ->isValidLocal($stdShow->show->local)
                    ->isValidData($stdShow->show->data)
                    ->hasNotShowByLocalData($stdShow->show->local, $stdShow->show->data);
                (new ShowController())->store($stdShow);
            } catch (Throwable $throwable) {
                $this->sendErrorResponse($throwable, 'Erro ao inserir um novo show');
            }
            exit();
        });

        $this->router->put('/shows/(\d+)', function ($id): never {
            try {

                $tokenMiddleware = new JWTMiddleware();
                $payload = $tokenMiddleware->isValidToken();

                $requestBody = file_get_contents("php://input");
                $showMiddleware = new ShowMiddleware();
                $stdShow = $showMiddleware->stringJsonToStdClass($requestBody);
                $showMiddleware
                    ->isValidId($id)
                    ->isValidLocal($stdShow->show->local)
                    ->isValidData($stdShow->show->data)
                    ->hasShowById($id);
                $stdShow->show->id = (int)$id;
                (new ShowController())->edit($stdShow);
            } catch (Throwable $throwable) {
                $this->sendErrorResponse($throwable, 'Erro na atualização dos dados');
            }
            exit();
        });

        $this->router->delete('/shows/(\d+)', function ($id): never {
            try {

                $tokenMiddleware = new JWTMiddleware();
                $payload = $tokenMiddleware->isValidToken();

                (new ShowMiddleware())->isValidId($id)->hasShowById($id);
                (new ShowController())->destroy((int)$id);
            } catch (Throwable $throwable) {
                $this->sendErrorResponse($throwable, 'Erro na exclusão de dados');
            }
            exit();
        });

        $this->router->get('/shows/exportar/csv', fn (): never => (new ShowController())->exportCSV());
        $this->router->get('/shows/exportar/json', fn (): never => (new ShowController())->exportJSON());
        $this->router->get('/shows/exportar/xml', fn (): never => (new ShowController())->exportXML());
        $this->router->post('/shows/importar/csv', fn (): never => (new ShowController())->importCSV($_FILES['csv']));
        $this->router->post('/shows/importar/json', fn (): never => (new ShowController())->importJson($_FILES['json']));
        $this->router->post('/shows/importar/xml', fn (): never => (new ShowController())->importXML($_FILES['xml']));
    }

    // --- Rotas de Participações ---
    private function setupParticipacaoRoutes(): void
    {
        $this->router->get('/participacoes', function (): never {
            try {
                $participacaoControl = new ParticipacaoController();
                if (isset($_GET['page']) && isset($_GET['limit'])) {
                    (new ParticipacaoMiddleware())
                        ->isValidPage($_GET['page'])
                        ->isValidLimit($_GET['limit']);
                    $participacaoControl->listPaginated((int)$_GET['page'], (int)$_GET['limit']);
                } else {
                    $participacaoControl->index();
                }
            } catch (Throwable $throwable) {
                $this->sendErrorResponse($throwable, 'Erro na seleção de dados');
            }
            exit();
        });

        $this->router->get('/participacoes/(\d+)/(\d+)', function ($id_banda, $id_show): never {
            try {
                (new ParticipacaoMiddleware())
                    ->isValidIds($id_banda, $id_show)
                    ->hasParticipacaoByIds($id_banda, $id_show);
                (new ParticipacaoController())->show((int)$id_banda, (int)$id_show);
            } catch (Throwable $throwable) {
                $this->sendErrorResponse($throwable, 'Erro na seleção de dados');
            }
            exit();
        });

        $this->router->post('/participacoes', function (): never {
            try {

                $tokenMiddleware = new JWTMiddleware();
                $payload = $tokenMiddleware->isValidToken();

                $requestBody = file_get_contents("php://input");
                $participacaoMiddleware = new ParticipacaoMiddleware();
                $stdParticipacao = $participacaoMiddleware->stringJsonToStdClass($requestBody);
                $participacaoMiddleware
                    ->isValidIds($stdParticipacao->participacao->id_banda, $stdParticipacao->participacao->id_show)
                    ->hasNotParticipacaoByIds($stdParticipacao->participacao->id_banda, $stdParticipacao->participacao->id_show);
                (new ParticipacaoController())->store($stdParticipacao);
            } catch (Throwable $throwable) {
                $this->sendErrorResponse($throwable, 'Erro ao inserir uma nova participação');
            }
            exit();
        });

        $this->router->put('/participacoes/(\d+)/(\d+)', function ($id_banda, $id_show): never {
            try {

                $tokenMiddleware = new JWTMiddleware();
                $payload = $tokenMiddleware->isValidToken();

                $requestBody = file_get_contents("php://input");
                $participacaoMiddleware = new ParticipacaoMiddleware();
                $stdParticipacao = $participacaoMiddleware->stringJsonToStdClass($requestBody);
                $participacaoMiddleware
                    ->isValidIds($id_banda, $id_show)
                    ->hasParticipacaoByIds($id_banda, $id_show);
                $stdParticipacao->participacao->id_banda = (int)$id_banda;
                $stdParticipacao->participacao->id_show = (int)$id_show;
                (new ParticipacaoController())->edit($stdParticipacao);
            } catch (Throwable $throwable) {
                $this->sendErrorResponse($throwable, 'Erro na atualização dos dados');
            }
            exit();
        });

        $this->router->delete('/participacoes/(\d+)/(\d+)', function ($id_banda, $id_show): never {
            try {

                $tokenMiddleware = new JWTMiddleware();
                $payload = $tokenMiddleware->isValidToken();

                (new ParticipacaoMiddleware())
                    ->isValidIds($id_banda, $id_show)
                    ->hasParticipacaoByIds($id_banda, $id_show);
                (new ParticipacaoController())->destroy((int)$id_banda, (int)$id_show);
            } catch (Throwable $throwable) {
                $this->sendErrorResponse($throwable, 'Erro na exclusão de dados');
            }
            exit();
        });

        $this->router->get('/participacoes/exportar/csv', fn (): never => (new ParticipacaoController())->exportCSV());
        $this->router->get('/participacoes/exportar/json', fn (): never => (new ParticipacaoController())->exportJSON());
        $this->router->get('/participacoes/exportar/xml', fn (): never => (new ParticipacaoController())->exportXML());
        $this->router->post('/participacoes/importar/csv', fn (): never => (new ParticipacaoController())->importCSV($_FILES['csv']));
        $this->router->post('/participacoes/importar/json', fn (): never => (new ParticipacaoController())->importJson($_FILES['json']));
        $this->router->post('/participacoes/importar/xml', fn (): never => (new ParticipacaoController())->importXML($_FILES['xml']));
    }

    // --- Backup ---
    private function setupBackupRoutes(): void
    {
        $this->router->get('/backup', function (): never {
            try {

                $tokenMiddleware = new JWTMiddleware();
                $payload = $tokenMiddleware->isValidToken();

                require_once "api/src/db/Database.php";
                Database::backup();
            } catch (Throwable $throwable) {
                $this->sendErrorResponse($throwable, 'Erro na seleção de dados');
            }
            exit();
        });
    }

    public function start(): void
    {
        $this->router->run();
    }
}