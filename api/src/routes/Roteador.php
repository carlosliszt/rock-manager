<?php

require_once "api/src/routes/Router.php"; // https://github.com/bramus/router
require_once "api/src/controllers/BandaController.php";
require_once "api/src/middlewares/BandaMiddleware.php";

require_once "api/src/controllers/ShowController.php";
require_once "api/src/middlewares/ShowMiddleware.php";

require_once "api/src/controllers/ParticipacaoController.php";
require_once "api/src/middlewares/ParticipacaoMiddleware.php";

require_once "api/src/middlewares/JWTMiddleware.php";

require_once "api/src/controllers/UsuarioBandaController.php";
require_once "api/src/middlewares/UsuarioBandaMiddleware.php";

require_once "api/src/controllers/UsuarioController.php";
require_once "api/src/middlewares/UsuarioMiddleware.php";

require_once "api/src/utils/Logger.php";
require_once "api/src/utils/JWTToken.php";
require_once "api/src/http/Response.php";

require_once "api/src/DAO/UsuarioBandaDAO.php";
require_once "api/src/DAO/ParticipacaoDAO.php";

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
        $this->setupUsuarioBandaRoutes();
        $this->setupLoginRoutes();
        $this->setupUsuarioRoutes();
        $this->setupSystemRoutes();
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

    private function setupUsuarioRoutes(): void
    {
        $this->router->get('/users', function (): never {
            try {
                (new UsuarioController())->index();
            } catch (Throwable $throwable) {
                $this->sendErrorResponse($throwable, 'Erro ao buscar usuários');
            }
            exit();
        });

        $this->router->get('/users/me', function (): never {
            try {
                $tokenMiddleware = new JWTMiddleware();
                $payload = $tokenMiddleware->isValidToken();
                $id = $payload->id ?? null;
                if (!$id) {
                    (new Response(
                        success: false,
                        message: 'Usuário não autenticado',
                        error: [
                            'code' => 'authorization_error',
                            'message' => 'Token inválido ou usuário não identificado'
                        ],
                        httpCode: 401
                    ))->send();
                    exit();
                }
                (new UsuarioController())->profile((int)$id);
            } catch (Throwable $throwable) {
                $this->sendErrorResponse($throwable, 'Erro ao buscar perfil do usuário');
            }
            exit();
        });

        $this->router->put('/users/(\d+)', function ($id): never {
            try {
                $tokenMiddleware = new JWTMiddleware();
                $payload = $tokenMiddleware->isValidToken();
                $role = $payload->role ?? null;
                if ($role !== 'admin' || $payload->id == $id) {
                    (new Response(
                        success: false,
                        message: 'Ação não permitida',
                        error: [
                            'code' => 'authorization_error',
                            'message' => 'Apenas admin pode atualizar outros usuários'
                        ],
                        httpCode: 403
                    ))->send();
                    exit();
                }
                $requestBody = file_get_contents("php://input");
                (new UsuarioController())->update((int)$id, $requestBody);
            } catch (Throwable $throwable) {
                $this->sendErrorResponse($throwable, 'Erro ao atualizar usuário');
            }
            exit();
        });

        $this->router->delete('/users/(\d+)', function ($id): never {
            try {
                $tokenMiddleware = new JWTMiddleware();
                $payload = $tokenMiddleware->isValidToken();
                $role = $payload->role ?? null;
                if ($role !== 'admin') {
                    (new Response(
                        success: false,
                        message: 'Ação não permitida',
                        error: [
                            'code' => 'authorization_error',
                            'message' => 'Apenas admin pode excluir usuários'
                        ],
                        httpCode: 403
                    ))->send();
                    exit();
                }
                (new UsuarioController())->destroy((int)$id);
            } catch (Throwable $throwable) {
                $this->sendErrorResponse($throwable, 'Erro ao excluir usuário');
            }
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

    private function setupUsuarioBandaRoutes(): void
    {
        $this->router->get('/bands/members', function (): never {
            try {
                $control = new UsuarioBandaController();
                if (isset($_GET['page']) && isset($_GET['limit'])) {
                    (new UsuarioBandaMiddleware())
                        ->isValidPage($_GET['page'])
                        ->isValidLimit($_GET['limit']);
                    $control->listPaginated((int)$_GET['page'], (int)$_GET['limit']);
                } else {
                    $control->index();
                }
            } catch (Throwable $throwable) {
                $this->sendErrorResponse($throwable, 'Erro na seleção de dados');
            }
            exit();
        });

        $this->router->get('/bands/(\d+)/members', function ($id_banda): never {
            try {
                (new BandaMiddleware())->isValidId($id_banda)->hasBandaById($id_banda);
                (new UsuarioBandaMiddleware())
                    ->hasMembersInBanda($id_banda);
                (new UsuarioBandaController())->showByBand((int)$id_banda);
            } catch (Throwable $throwable) {
                $this->sendErrorResponse($throwable, 'Erro ao buscar membros da banda');
            }
            exit();
        });

        $this->router->get('/bands/members/(\d+)/(\d+)', function ($id_usuario, $id_banda): never {
            try {
                (new UsuarioBandaMiddleware())
                    ->isValidIds($id_usuario, $id_banda)
                    ->hasVinculoByIds($id_usuario, $id_banda);
                (new UsuarioBandaController())->show((int)$id_usuario, (int)$id_banda);
            } catch (Throwable $throwable) {
                $this->sendErrorResponse($throwable, 'Erro na seleção de dados');
            }
            exit();
        });

        $this->router->post('/bands/members', function (): never {
            try {
                $tokenMiddleware = new JWTMiddleware();
                $payload = $tokenMiddleware->isValidToken();
                $role = $payload->role ?? null;

                if ($role !== 'musician' && $role !== 'admin') {
                    (new Response(
                        success: false,
                        message: 'Ação não permitida',
                        error: [
                            'code' => 'authorization_error',
                            'message' => 'Apenas gerentes ou admin podem criar vínculos'
                        ],
                        httpCode: 403
                    ))->send();
                    exit();
                }

                $requestBody = file_get_contents("php://input");
                $middleware = new UsuarioBandaMiddleware();
                $stdVinculo = $middleware->stringJsonToStdClass($requestBody);
                $middleware
                    ->isValidIds($stdVinculo->usuario_banda->id_usuario, $stdVinculo->usuario_banda->id_banda)
                    ->isValidFuncao($stdVinculo->usuario_banda->funcao)
                    ->hasNotVinculoByIds($stdVinculo->usuario_banda->id_usuario, $stdVinculo->usuario_banda->id_banda);
                (new UsuarioBandaController())->store($stdVinculo);
            } catch (Throwable $throwable) {
                $this->sendErrorResponse($throwable, 'Erro ao inserir vínculo');
            }
            exit();
        });

        $this->router->put('/bands/members/(\d+)/(\d+)', function ($id_usuario, $id_banda): never {
            try {
                $tokenMiddleware = new JWTMiddleware();
                $payload = $tokenMiddleware->isValidToken();
                $role = $payload->role ?? null;

                if ($role !== 'musician' && $role !== 'admin') {
                    (new Response(
                        success: false,
                        message: 'Ação não permitida',
                        error: [
                            'code' => 'authorization_error',
                            'message' => 'Apenas gerentes ou admin podem editar vínculos'
                        ],
                        httpCode: 403
                    ))->send();
                    exit();
                }

                $requestBody = file_get_contents("php://input");
                $middleware = new UsuarioBandaMiddleware();
                $stdVinculo = $middleware->stringJsonToStdClass($requestBody);
                $middleware
                    ->isValidIds($id_usuario, $id_banda)
                    ->isValidFuncao($stdVinculo->usuario_banda->funcao)
                    ->hasVinculoByIds($id_usuario, $id_banda);
                $stdVinculo->usuario_banda->id_usuario = (int)$id_usuario;
                $stdVinculo->usuario_banda->id_banda = (int)$id_banda;
                (new UsuarioBandaController())->edit($stdVinculo);
            } catch (Throwable $throwable) {
                $this->sendErrorResponse($throwable, 'Erro na atualização do vínculo');
            }
            exit();
        });

        $this->router->delete('/bands/members/(\d+)/(\d+)', function ($id_usuario, $id_banda): never {
            try {
                $tokenMiddleware = new JWTMiddleware();
                $payload = $tokenMiddleware->isValidToken();
                $role = $payload->role ?? null;

                if ($role !== 'musician' && $role !== 'admin') {
                    (new Response(
                        success: false,
                        message: 'Ação não permitida',
                        error: [
                            'code' => 'authorization_error',
                            'message' => 'Apenas gerentes ou admin podem excluir vínculos'
                        ],
                        httpCode: 403
                    ))->send();
                    exit();
                }

                (new UsuarioBandaMiddleware())
                    ->isValidIds($id_usuario, $id_banda)
                    ->hasVinculoByIds($id_usuario, $id_banda);
                (new UsuarioBandaController())->destroy((int)$id_usuario, (int)$id_banda);
            } catch (Throwable $throwable) {
                $this->sendErrorResponse($throwable, 'Erro na exclusão do vínculo');
            }
            exit();
        });

        $this->router->get('/bands/members/exportar/csv', fn (): never => (new UsuarioBandaController())->exportCSV());
        $this->router->get('/bands/members/exportar/json', fn (): never => (new UsuarioBandaController())->exportJSON());
        $this->router->get('/bands/members/exportar/xml', fn (): never => (new UsuarioBandaController())->exportXML());

        $this->router->post('/bands/members/importar/csv', function (): never {
            $tokenMiddleware = new JWTMiddleware();
            $payload = $tokenMiddleware->isValidToken();
            $role = $payload->role ?? null;

            if ($role !== 'admin') {
                (new Response(
                    success: false,
                    message: 'Ação não permitida',
                    error: [
                        'code' => 'authorization_error',
                        'message' => 'Apenas admin pode importar vínculos'
                    ],
                    httpCode: 403
                ))->send();
                exit();
            }

            (new UsuarioBandaController())->importCSV($_FILES['csv']);
            exit();
        });

        $this->router->post('/bands/members/importar/json', function (): never {
            $tokenMiddleware = new JWTMiddleware();
            $payload = $tokenMiddleware->isValidToken();
            $role = $payload->role ?? null;

            if ($role !== 'admin') {
                (new Response(
                    success: false,
                    message: 'Ação não permitida',
                    error: [
                        'code' => 'authorization_error',
                        'message' => 'Apenas admin pode importar vínculos'
                    ],
                    httpCode: 403
                ))->send();
                exit();
            }

            (new UsuarioBandaController())->importJson($_FILES['json']);
            exit();
        });

        $this->router->post('/bands/members/importar/xml', function (): never {
            $tokenMiddleware = new JWTMiddleware();
            $payload = $tokenMiddleware->isValidToken();
            $role = $payload->role ?? null;

            if ($role !== 'admin') {
                (new Response(
                    success: false,
                    message: 'Ação não permitida',
                    error: [
                        'code' => 'authorization_error',
                        'message' => 'Apenas admin pode importar vínculos'
                    ],
                    httpCode: 403
                ))->send();
                exit();
            }

            (new UsuarioBandaController())->importXML($_FILES['xml']);
            exit();
        });
    }

    // --- Rotas de Bandas ---
    private function setupBandaRoutes(): void
    {
        $this->router->get('/bands', function (): never {
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

        $this->router->get('/bands/(\d+)', function ($id): never {
            try {
                (new BandaMiddleware())->isValidId($id)->hasBandaById($id);
                (new BandaController())->show((int)$id);
            } catch (Throwable $throwable) {
                $this->sendErrorResponse($throwable, 'Erro na seleção de dados');
            }
            exit();
        });

        $this->router->post('/bands', function (): never {
            try {

                $tokenMiddleware = new JWTMiddleware();
                $payload = $tokenMiddleware->isValidToken();

                $role = $payload->role ?? null;

               if($role !== 'admin' && $role != "musician") {
                    (new Response(
                        success: false,
                        message: 'Ação não permitida',
                        error: [
                            'code' => 'authorization_error',
                            'message' => 'Apenas músicos ou admin podem criar bandas'
                        ],
                        httpCode: 403
                    ))->send();
                    exit();
               }

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

        $this->router->put('/bands/(\d+)', function ($id): never {
            try {
                $tokenMiddleware = new JWTMiddleware();
                $payload = $tokenMiddleware->isValidToken();
                $id_usuario = $payload->id ?? null;
                $role = $payload->role ?? null;

                if ($role !== 'admin') {
                    $usuarioBandaDAO = new UsuarioBandaDAO();
                    if (!$usuarioBandaDAO->existeVinculo($id_usuario, $id)) {
                        (new Response(
                            success: false,
                            message: 'Usuário não está vinculado à banda',
                            error: [
                                'code' => 'authorization_error',
                                'message' => 'Apenas membros da banda podem alterar'
                            ],
                            httpCode: 403
                        ))->send();
                        exit();
                    }
                }

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

        $this->router->delete('/bands/(\d+)', function ($id): never {
            try {
                $tokenMiddleware = new JWTMiddleware();
                $payload = $tokenMiddleware->isValidToken();
                $id_usuario = $payload->id_usuario ?? null;
                $role = $payload->role ?? null;

                if ($role !== 'admin') {
                    $usuarioBandaDAO = new UsuarioBandaDAO();
                    if (!$usuarioBandaDAO->existeVinculo($id_usuario, $id)) {
                        (new Response(
                            success: false,
                            message: 'Usuário não está vinculado à banda',
                            error: [
                                'code' => 'authorization_error',
                                'message' => 'Apenas membros da banda podem excluir'
                            ],
                            httpCode: 403
                        ))->send();
                        exit();
                    }
                }

                (new BandaMiddleware())->isValidId($id)->hasBandaById($id);
                (new BandaController())->destroy((int)$id);
            } catch (Throwable $throwable) {
                $this->sendErrorResponse($throwable, 'Erro na exclusão de dados');
            }
            exit();
        });

        $this->router->get('/bands/exportar/csv', fn (): never => (new BandaController())->exportCSV());
        $this->router->get('/bands/exportar/json', fn (): never => (new BandaController())->exportJSON());
        $this->router->get('/bands/exportar/xml', fn (): never => (new BandaController())->exportXML());
        $this->router->post('/bands/importar/csv', function (): never {
            $tokenMiddleware = new JWTMiddleware();
            $payload = $tokenMiddleware->isValidToken();
            $role = $payload->role ?? null;

            if ($role !== 'admin') {
                (new Response(
                    success: false,
                    message: 'Ação não permitida',
                    error: [
                        'code' => 'authorization_error',
                        'message' => 'Apenas admin pode importar bandas'
                    ],
                    httpCode: 403
                ))->send();
                exit();
            }

            (new BandaController())->importCSV($_FILES['csv']);
            exit();
        });

        $this->router->post('/bands/importar/json', function (): never {
            $tokenMiddleware = new JWTMiddleware();
            $payload = $tokenMiddleware->isValidToken();
            $role = $payload->role ?? null;

            if ($role !== 'admin') {
                (new Response(
                    success: false,
                    message: 'Ação não permitida',
                    error: [
                        'code' => 'authorization_error',
                        'message' => 'Apenas admin pode importar bandas'
                    ],
                    httpCode: 403
                ))->send();
                exit();
            }

            (new BandaController())->importJson($_FILES['json']);
            exit();
        });

        $this->router->post('/bands/importar/xml', function (): never {
            $tokenMiddleware = new JWTMiddleware();
            $payload = $tokenMiddleware->isValidToken();
            $role = $payload->role ?? null;

            if ($role !== 'admin') {
                (new Response(
                    success: false,
                    message: 'Ação não permitida',
                    error: [
                        'code' => 'authorization_error',
                        'message' => 'Apenas admin pode importar bandas'
                    ],
                    httpCode: 403
                ))->send();
                exit();
            }

            (new BandaController())->importXML($_FILES['xml']);
            exit();
        });
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
                $role = $payload->role ?? null;

                if ($role !== 'organizador' && $role !== 'admin') {
                    (new Response(
                        success: false,
                        message: 'Ação não permitida',
                        error: [
                            'code' => 'authorization_error',
                            'message' => 'Apenas organizadores ou admins podem criar shows'
                        ],
                        httpCode: 403
                    ))->send();
                    exit();
                }

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
                $role = $payload->role ?? null;

                if ($role !== 'organizador' && $role !== 'admin') {
                    (new Response(
                        success: false,
                        message: 'Ação não permitida',
                        error: [
                            'code' => 'authorization_error',
                            'message' => 'Apenas organizadores ou admins podem editar shows'
                        ],
                        httpCode: 403
                    ))->send();
                    exit();
                }

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
                $role = $payload->role ?? null;

                if ($role !== 'organizador' && $role !== 'admin') {
                    (new Response(
                        success: false,
                        message: 'Ação não permitida',
                        error: [
                            'code' => 'authorization_error',
                            'message' => 'Apenas organizadores ou admins podem excluir shows'
                        ],
                        httpCode: 403
                    ))->send();
                    exit();
                }

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

        $this->router->post('/shows/importar/csv', function (): never {
            try {
                $tokenMiddleware = new JWTMiddleware();
                $payload = $tokenMiddleware->isValidToken();
                $role = $payload->role ?? null;

                if ($role !== 'organizador' && $role !== 'admin') {
                    (new Response(
                        success: false,
                        message: 'Ação não permitida',
                        error: [
                            'code' => 'authorization_error',
                            'message' => 'Apenas organizadores ou admins podem importar shows'
                        ],
                        httpCode: 403
                    ))->send();
                    exit();
                }

                (new ShowController())->importCSV($_FILES['csv']);
            } catch (Throwable $throwable) {
                $this->sendErrorResponse($throwable, 'Erro ao importar shows');
            }
            exit();
        });

        $this->router->post('/shows/importar/json', function (): never {
            try {
                $tokenMiddleware = new JWTMiddleware();
                $payload = $tokenMiddleware->isValidToken();
                $role = $payload->role ?? null;

                if ($role !== 'organizador' && $role !== 'admin') {
                    (new Response(
                        success: false,
                        message: 'Ação não permitida',
                        error: [
                            'code' => 'authorization_error',
                            'message' => 'Apenas organizadores ou admins podem importar shows'
                        ],
                        httpCode: 403
                    ))->send();
                    exit();
                }

                (new ShowController())->importJson($_FILES['json']);
            } catch (Throwable $throwable) {
                $this->sendErrorResponse($throwable, 'Erro ao importar shows');
            }
            exit();
        });

        $this->router->post('/shows/importar/xml', function (): never {
            try {
                $tokenMiddleware = new JWTMiddleware();
                $payload = $tokenMiddleware->isValidToken();
                $role = $payload->role ?? null;

                if ($role !== 'organizador' && $role !== 'admin') {
                    (new Response(
                        success: false,
                        message: 'Ação não permitida',
                        error: [
                            'code' => 'authorization_error',
                            'message' => 'Apenas organizadores ou admins podem importar shows'
                        ],
                        httpCode: 403
                    ))->send();
                    exit();
                }

                (new ShowController())->importXML($_FILES['xml']);
            } catch (Throwable $throwable) {
                $this->sendErrorResponse($throwable, 'Erro ao importar shows');
            }
            exit();
        });
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

        $this->router->get('/bands/(\d+)/shows', function ($id_banda): never {
            try {
                (new BandaMiddleware())->isValidId($id_banda)->hasBandaById($id_banda);
                (new ParticipacaoMiddleware())
                    ->hasShowsByBanda($id_banda);
                (new ParticipacaoController())->showByBand((int)$id_banda);
            } catch (Throwable $throwable) {
                $this->sendErrorResponse($throwable, 'Erro ao buscar participacoes da banda');
            }
            exit();
        });

        $this->router->post('/participacoes', function (): never {
            try {
                $tokenMiddleware = new JWTMiddleware();
                $payload = $tokenMiddleware->isValidToken();
                $id_usuario = $payload->id ?? null;
                $role = $payload->role ?? null;

                $requestBody = file_get_contents("php://input");
                $participacaoMiddleware = new ParticipacaoMiddleware();
                $stdParticipacao = $participacaoMiddleware->stringJsonToStdClass($requestBody);

                $id_banda = $stdParticipacao->participacao->id_banda;

                if ($role !== 'admin' && $role !== 'organizador') {
                    $usuarioBandaDAO = new UsuarioBandaDAO();
                    if (!$usuarioBandaDAO->existeVinculo((int)$id_usuario, (int)$id_banda)) {
                        (new Response(
                            success: false,
                            message: 'Ação não permitida',
                            error: [
                                'code' => 'authorization_error',
                                'message' => 'Apenas organizadores, admin ou membros da banda podem criar participações'
                            ],
                            httpCode: 403
                        ))->send();
                        exit();
                    }
                }

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
                $id_usuario = $payload->id ?? null;
                $role = $payload->role ?? null;

                if ($role !== 'admin') {
                    if (!isset($id_usuario) || !is_numeric($id_usuario)) {
                        (new Response(
                            success: false,
                            message: 'Usuário não autenticado',
                            error: [
                                'code' => 'authorization_error',
                                'message' => 'Token inválido ou usuário não identificado'
                            ],
                            httpCode: 401
                        ))->send();
                        exit();
                    }
                    $usuarioBandaDAO = new UsuarioBandaDAO();
                    if (!$usuarioBandaDAO->existeVinculo((int)$id_usuario, (int)$id_banda)) {
                        (new Response(
                            success: false,
                            message: 'Usuário não está vinculado à banda',
                            error: [
                                'code' => 'authorization_error',
                                'message' => 'Apenas membros da banda ou admin podem editar participações'
                            ],
                            httpCode: 403
                        ))->send();
                        exit();
                    }
                }

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
                $id_usuario = $payload->id ?? null;
                $role = $payload->role ?? null;

                if ($role !== 'admin') {
                    if (!isset($id_usuario) || !is_numeric($id_usuario)) {
                        (new Response(
                            success: false,
                            message: 'Usuário não autenticado',
                            error: [
                                'code' => 'authorization_error',
                                'message' => 'Token inválido ou usuário não identificado'
                            ],
                            httpCode: 401
                        ))->send();
                        exit();
                    }
                    $usuarioBandaDAO = new UsuarioBandaDAO();
                    if (!$usuarioBandaDAO->existeVinculo((int)$id_usuario, (int)$id_banda)) {
                        (new Response(
                            success: false,
                            message: 'Usuário não está vinculado à banda',
                            error: [
                                'code' => 'authorization_error',
                                'message' => 'Apenas membros da banda ou admin podem excluir participações'
                            ],
                            httpCode: 403
                        ))->send();
                        exit();
                    }
                }

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

        $this->router->post('/participacoes/importar/csv', function (): never {
            try {
                $tokenMiddleware = new JWTMiddleware();
                $payload = $tokenMiddleware->isValidToken();
                $role = $payload->role ?? null;

                if ($role !== 'admin') {
                    (new Response(
                        success: false,
                        message: 'Ação não permitida',
                        error: [
                            'code' => 'authorization_error',
                            'message' => 'Apenas admin pode importar participações'
                        ],
                        httpCode: 403
                    ))->send();
                    exit();
                }

                (new ParticipacaoController())->importCSV($_FILES['csv']);
            } catch (Throwable $throwable) {
                $this->sendErrorResponse($throwable, 'Erro ao importar participações');
            }
            exit();
        });

        $this->router->post('/participacoes/importar/json', function (): never {
            try {
                $tokenMiddleware = new JWTMiddleware();
                $payload = $tokenMiddleware->isValidToken();
                $role = $payload->role ?? null;

                if ($role !== 'admin') {
                    (new Response(
                        success: false,
                        message: 'Ação não permitida',
                        error: [
                            'code' => 'authorization_error',
                            'message' => 'Apenas admin pode importar participações'
                        ],
                        httpCode: 403
                    ))->send();
                    exit();
                }

                (new ParticipacaoController())->importJson($_FILES['json']);
            } catch (Throwable $throwable) {
                $this->sendErrorResponse($throwable, 'Erro ao importar participações');
            }
            exit();
        });

        $this->router->post('/participacoes/importar/xml', function (): never {
            try {
                $tokenMiddleware = new JWTMiddleware();
                $payload = $tokenMiddleware->isValidToken();
                $role = $payload->role ?? null;

                if ($role !== 'admin') {
                    (new Response(
                        success: false,
                        message: 'Ação não permitida',
                        error: [
                            'code' => 'authorization_error',
                            'message' => 'Apenas admin pode importar participações'
                        ],
                        httpCode: 403
                    ))->send();
                    exit();
                }

                (new ParticipacaoController())->importXML($_FILES['xml']);
            } catch (Throwable $throwable) {
                $this->sendErrorResponse($throwable, 'Erro ao importar participações');
            }
            exit();
        });
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

    private function setupSystemRoutes(): void
    {
        $this->router->get('/sys/activity', function (): never {
            try {
                $logFile = "system/log.log";
                $separador = str_repeat('*', 100);
                $blocks = [];
                if (file_exists($logFile)) {
                    $lines = file($logFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
                    $block = [];
                    for ($i = 0; $i < count($lines); $i++) {
                        $block[] = $lines[$i];
                        if (trim($lines[$i]) === $separador) {
                            $blocks[] = implode("\n", $block);
                            $block = [];
                        }
                    }
                    $blocks = array_slice($blocks, -20);
                }
                (new Response(
                    success: true,
                    message: 'Atividade recente do sistema.',
                    data: ['activity' => array_reverse($blocks)],
                    httpCode: 200
                ))->send();
            } catch (Throwable $throwable) {
                $this->sendErrorResponse($throwable, 'Erro ao buscar atividade do sistema');
            }
            exit();
        });

        $this->router->get('/sys/logs', function (): never {
            try {
                $logFile = "system/log.log";
                $separador = str_repeat('*', 100);
                $blocks = [];
                if (file_exists($logFile)) {
                    $lines = file($logFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
                    $block = [];
                    for ($i = 0; $i < count($lines); $i++) {
                        $block[] = $lines[$i];
                        if (trim($lines[$i]) === $separador) {
                            $blocks[] = implode("\n", $block);
                            $block = [];
                        }
                    }
                }
                (new Response(
                    success: true,
                    message: 'Logs do sistema.',
                    data: ['logs' => $blocks],
                    httpCode: 200
                ))->send();
            } catch (Throwable $throwable) {
                $this->sendErrorResponse($throwable, 'Erro ao buscar logs do sistema');
            }
            exit();
        });

        $this->router->post('/sys/cleanup', function (): never {
            try {
                $tokenMiddleware = new JWTMiddleware();
                $payload = $tokenMiddleware->isValidToken();
                $role = $payload->role ?? null;
                if ($role !== 'admin') {
                    (new Response(
                        success: false,
                        message: 'Ação não permitida',
                        error: [
                            'code' => 'authorization_error',
                            'message' => 'Apenas admin pode executar limpeza'
                        ],
                        httpCode: 403
                    ))->send();
                    exit();
                }
                $body = file_get_contents('php://input');
                $params = json_decode($body, true);
                $result = [];
                if (!empty($params['cleanupParticipations'])) {
                    $dao = new ParticipacaoDAO();
                    $qtd = $dao->deleteOrfas();
                    $result[] = "$qtd participações órfãs removidas";
                }
                if (!empty($params['cleanupMembers'])) {
                    $dao = new UsuarioBandaDAO();
                    $qtd = $dao->deleteOrfas();
                    $result[] = "$qtd membros órfãos removidos";
                }
                if (!empty($params['cleanupLogs'])) {
                    $logFile = 'system/log.log';
                    $separador = str_repeat('*', 100);
                    if (file_exists($logFile)) {
                        $lines = file($logFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
                        $now = time();
                        $kept = [];
                        $removed = 0;
                        $block = [];
                        $removeBlock = false;
                        foreach ($lines as $line) {
                            if (preg_match('/^\[(.*?)\]/', $line, $m)) {
                                $date = strtotime($m[1]);
                                $removeBlock = ($date !== false && ($now - $date) > 30*24*60*60);
                            }
                            $block[] = $line;
                            if (trim($line) === $separador) {
                                if (!$removeBlock) {
                                    $kept = array_merge($kept, $block);
                                } else {
                                    $removed += count($block);
                                }
                                $block = [];
                                $removeBlock = false;
                            }
                        }
                        file_put_contents($logFile, implode("\n", $kept));
                        $result[] = "$removed linhas de logs antigos removidas";
                    }
                }
                (new Response(
                    success: true,
                    message: 'Limpeza concluída.',
                    data: ['result' => $result],
                    httpCode: 200
                ))->send();
            } catch (Throwable $throwable) {
                $this->sendErrorResponse($throwable, 'Erro ao executar limpeza de dados');
            }
            exit();
        });
    }

    public function start(): void
    {
        $this->router->run();
    }
}

