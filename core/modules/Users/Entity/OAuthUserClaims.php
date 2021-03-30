<?php

namespace SuiteCRM\Core\Modules\Users\Entity;

class OAuthUserClaims
{
    /**
     * @var string
     */
    private $id;

    /**
     * @var string
     */
    private $id_token;

    /**
     * @var string
     */
    private $user_id;

    /**
     * @var string
     */
    private $user;

    /**
     * Get the value of Id
     *
     * @return string
     */
    public function getId(): string
    {
        return $this->id;
    }

    /**
     * Set the value of Id
     *
     * @param string id
     *
     * @return self
     */
    public function setId($id): self
    {
        $this->id = $id;

        return $this;
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

    /**
     * Get the value of User Id
     *
     * @return string
     */
    public function getUserId(): string
    {
        return $this->user_id;
    }

    /**
     * Set the value of User Id
     *
     * @param string user_id
     *
     * @return self
     */
    public function setUserId($user_id): self
    {
        $this->user_id = $user_id;

        return $this;
    }

}
