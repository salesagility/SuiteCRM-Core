<?php

namespace SuiteCRM\Core\Modules\Users\Entity;

class OAuthAuthorizationCode
{
    /**
     * @var int
     */
    private $id;

    /**
     * @var string
     */
    private $code;

    /**
     * @var string
     */
    private $client_id;

    /**
     * @var string
     */
    private $user_id;

    /**
     * @var \DateTime
     */
    private $expires;

    /**
     * @var string
     */
    private $redirect_uri;

    /**
     * @var string
     */
    private $scope;

    /**
     * @var string
     */
    private $id_token;

    /**
     * @var OAuthClient
     */
    private $client;

    /**
     * @var OAuthUser
     */
    private $user;

    /**
     * Get id
     *
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * Set code
     *
     * @param string $code
     * @return OAuthAuthorizationCode
     */
    public function setCode($code): OAuthAuthorizationCode
    {
        $this->code = $code;

        return $this;
    }

    /**
     * Get code
     *
     * @return string
     */
    public function getCode(): string
    {
        return $this->code;
    }

    /**
     * Set client_id
     *
     * @param string $clientId
     * @return OAuthAuthorizationCode
     */
    public function setClientId($clientId): OAuthAuthorizationCode
    {
        $this->client_id = $clientId;

        return $this;
    }

    /**
     * Get client_id
     *
     * @return string
     */
    public function getClientId(): string
    {
        return $this->client_id;
    }

    /**
     * Set user_id
     *
     * @param $userId
     * @return OAuthAuthorizationCode
     */
    public function setUserId($userId): OAuthAuthorizationCode
    {
        $this->user_id = $userId;

        return $this;
    }

    /**
     * Get user_identifier
     *
     * @return string
     */
    public function getUserId(): string
    {
        return $this->user_id;
    }

    /**
     * Set expires
     *
     * @param \DateTime $expires
     * @return OAuthAuthorizationCode
     */
    public function setExpires($expires): OAuthAuthorizationCode
    {
        $this->expires = $expires;

        return $this;
    }

    /**
     * Get expires
     *
     * @return \DateTime
     */
    public function getExpires(): \DateTime
    {
        return $this->expires;
    }

    /**
     * Set redirect_uri
     *
     * @param string $redirectUri
     * @return OAuthAuthorizationCode
     */
    public function setRedirectUri($redirectUri): OAuthAuthorizationCode
    {
        $this->redirect_uri = $redirectUri;

        return $this;
    }

    /**
     * Get redirect_uri
     *
     * @return string
     */
    public function getRedirectUri(): string
    {
        return $this->redirect_uri;
    }

    /**
     * Set scope
     *
     * @param string $scope
     * @return OAuthAuthorizationCode
     */
    public function setScope($scope): OAuthAuthorizationCode
    {
        $this->scope = $scope;

        return $this;
    }

    /**
     * Get scope
     *
     * @return string
     */
    public function getScope(): string
    {
        return $this->scope;
    }

    /**
     * Set client
     *
     * @param OAuthClient $client
     * @return OAuthAuthorizationCode
     */
    public function setClient(OAuthClient $client = null): OAuthAuthorizationCode
    {
        $this->client = $client;

        return $this;
    }

    /**
     * Get client
     *
     * @return OAuthClient
     */
    public function getClient(): OAuthClient
    {
        return $this->client;
    }

    /**
     * Set user
     *
     * @param OAuthUser $user
     * @return OAuthRefreshToken
     */
    public function setUser(OAuthUser $user = null): OAuthRefreshToken
    {
        $this->user = $user;

        return $this;
    }

    /**
     * Get user
     *
     * @return \YourNamespace\Entity\OAuthUser
     */
    public function getUser(): \YourNamespace\Entity\OAuthUser
    {
        return $this->client;
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        return [
            'code' => $this->code,
            'client_id' => $this->client_id,
            'user_id' => $this->user_id,
            'expires' => $this->expires,
            'scope' => $this->scope,
        ];
    }

    /**
     * @param $params
     * @return OAuthAuthorizationCode
     */
    public static function fromArray($params): OAuthAuthorizationCode
    {
        $code = new self();
        foreach ($params as $property => $value) {
            $code->$property = $value;
        }

        return $code;
    }

    /**
     * Get the value of Id Token
     *
     * @return string
     */
    public function getIdToken(): string
    {
        return $this->id_token;
    }

    /**
     * Set the value of Id Token
     *
     * @param string id_token
     *
     * @return self
     */
    public function setIdToken($id_token): self
    {
        $this->id_token = $id_token;

        return $this;
    }

}
