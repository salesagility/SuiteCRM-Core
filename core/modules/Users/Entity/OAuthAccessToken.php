<?php

namespace SuiteCRM\Core\Modules\Users\Entity;

/**
 * OAuthAccessToken
 */
class OAuthAccessToken
{
    /**
     * @var int
     */
    private $id;

    /**
     * @var string
     */
    private $token;

    /**
     * @var string
     */
    private $client_id;

    /**
     * @var string
     */
    private $user_id;

    /**
     * @var timestamp
     */
    private $expires;

    /**
     * @var string
     */
    private $scope;

    /**
     * @var \YourNamespace\Entity\OAuthClient
     */
    private $client;

    /**
     * @var \YourNamespace\Entity\OAuthUser
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
     * Set token
     *
     * @param string $token
     * @return OAuthAccessToken
     */
    public function setToken($token): OAuthAccessToken
    {
        $this->token = $token;

        return $this;
    }

    /**
     * Get token
     *
     * @return string
     */
    public function getToken(): string
    {
        return $this->token;
    }

    /**
     * Set client_id
     *
     * @param string $clientId
     * @return OAuthAccessToken
     */
    public function setClientId($clientId): OAuthAccessToken
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
     * @return OAuthAccessToken
     */
    public function setUserId($userId): OAuthAccessToken
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
     * @return OAuthAccessToken
     */
    public function setExpires($expires): OAuthAccessToken
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
     * Set scope
     *
     * @param string $scope
     * @return OAuthAccessToken
     */
    public function setScope($scope): OAuthAccessToken
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
     * @param SuiteCRM\Core\Modules\Users\Entity\OAuthClient $client
     * @return OAuthAccessToken
     */
    public function setClient(SuiteCRM\Core\Modules\Users\Entity\OAuthClient $client = null): OAuthAccessToken
    {
        $this->client = $client;

        return $this;
    }

    /**
     * Get client
     *
     * @return SuiteCRM\Core\Modules\Users\Entity\OAuthClient
     */
    public function getClient(): SuiteCRM\Core\Modules\Users\Entity\OAuthClient
    {
        return $this->client;
    }

    /**
     * @param $params
     * @return OAuthAccessToken
     */
    public static function fromArray($params): OAuthAccessToken
    {
        $token = new self();
        foreach ($params as $property => $value) {
            $token->$property = $value;
        }

        return $token;
    }

    /**
     * Set user
     *
     * @param SuiteCRM\Core\Modules\Users\Entity\OAuthUser $user
     * @return OAuthRefreshToken
     */
    public function setUser(SuiteCRM\Core\Modules\Users\Entity\OAuthUser $user = null): OAuthRefreshToken
    {
        $this->user = $user;

        return $this;
    }

    /**
     * Get user
     *
     * @return SuiteCRM\Core\Modules\Users\Entity\OAuthUser
     */
    public function getUser(): SuiteCRM\Core\Modules\Users\Entity\OAuthUser
    {
        return $this->client;
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        return [
            'token' => $this->token,
            'client_id' => $this->client_id,
            'user_id' => $this->user_id,
            'expires' => $this->expires,
            'scope' => $this->scope,
        ];
    }
}
