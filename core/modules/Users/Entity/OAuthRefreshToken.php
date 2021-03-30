<?php

namespace SuiteCRM\Core\Modules\Users\Entity;

class OAuthRefreshToken
{
    /**
     * @var int
     */
    private $id;

    /**
     * @var string
     */
    private $refresh_token;

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
     * @var SuiteCRM\Core\Modules\Users\Entity\OAuthClient
     */
    private $client;

    /**
     * @var SuiteCRM\Core\Modules\Users\Entity\OAuthUser
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
     * Set refresh_token
     *
     * @param string $refresh_token
     * @return OAuthRefreshToken
     */
    public function setRefreshToken($refresh_token): OAuthRefreshToken
    {
        $this->refresh_token = $refresh_token;

        return $this;
    }

    /**
     * Get refresh_token
     *
     * @return string
     */
    public function getRefreshToken(): string
    {
        return $this->refresh_token;
    }

    /**
     * Set client_id
     *
     * @param string $clientId
     * @return OAuthRefreshToken
     */
    public function setClientId($clientId): OAuthRefreshToken
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
     * @return OAuthRefreshToken
     */
    public function setUserId($userId): OAuthRefreshToken
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
     * @return OAuthRefreshToken
     */
    public function setExpires($expires): OAuthRefreshToken
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
     * @return OAuthRefreshToken
     */
    public function setScope($scope): OAuthRefreshToken
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
     * @return OAuthRefreshToken
     */
    public function setClient(SuiteCRM\Core\Modules\Users\Entity\OAuthClient $client = null): OAuthRefreshToken
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
            'refresh_token' => $this->refresh_token,
            'client_id' => $this->client_id,
            'user_id' => $this->user_id,
            'expires' => $this->expires,
            'scope' => $this->scope,
        ];
    }

    /**
     * @param $params
     * @return OAuthRefreshToken
     */
    public static function fromArray($params): OAuthRefreshToken
    {
        $token = new self();
        foreach ($params as $property => $value) {
            $token->$property = $value;
        }

        return $token;
    }
}
