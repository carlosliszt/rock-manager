<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JWTToken
{

    private const KEY = "y9I@yApR-/hoP'+=7:g#+pY9^'/00b:?RFXt$@nA~H3`V;J')3VBBXi&*@o|";
    private const ALGORITHM = 'HS256';
    private const TYPE = 'JWT';

    public function __construct(
        private stdClass $payload = new stdClass(),
        private string $iss = 'http://localhost',
        private string $aud = 'http://localhost',
        private string $sub = 'api_key',
        private int $duration = 3600 * 24 * 30
    ) { }


    public function generateToken(stdClass $claims): string {
        $now = time();

        $headers = [
            'typ' => self::TYPE,
            'alg' => self::ALGORITHM
        ];

        $payload = [
            'iss' => $this->iss,
            'aud' => $this->aud,
            'sub' => $this->sub,
            'exp' => $now + $this->duration,
            'iat' => $now,
            'nbf' => $now,
            'jti' => bin2hex(random_bytes(16)),
        ];

        if (isset($claims->payload->public) && is_object($claims->payload->public)) {
            foreach ($claims->payload->public as $key => $value) {
                $payload[$key] = $value;
            }
        }

        if (isset($claims->payload->private) && is_object($claims->payload->private)) {
            foreach ($claims->payload->private as $key => $value) {
                $payload[$key] = $value;
            }
        }

        return JWT::encode(
            payload: $payload,
            key: self::KEY,
            alg: self::ALGORITHM,
            keyId: null,
            head: $headers
        );
    }

    public function validate($tokenStr): bool {
        if (empty($tokenStr)) {
            return false;
        }

        $token = str_replace('Bearer ', '', $tokenStr);

        $pattern = '/^[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$/';
        if (!preg_match($pattern, $token)) {
            return false;
        }

        try {
            $decoded = JWT::decode(
                jwt: $token,
                keyOrKeyArray: new Key(
                    keyMaterial: self::KEY,
                    algorithm: self::ALGORITHM
                )
            );

            $this->payload = $decoded;
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function stringJsonToStdClass($requestBody): \stdClass {
        $stdPayload = json_decode($requestBody);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new InvalidArgumentException('Json inválido');
        } else if (!isset($stdPayload->payload)) {
            throw new InvalidArgumentException('Não foi enviado o objeto payload');
        }

        return $stdPayload;
    }

    public function getPayload(): stdClass|null
    {
        return $this->payload;
    }
    public function setPayload(stdClass $payload): self
    {
        $this->payload = $payload;
        return $this;
    }

}