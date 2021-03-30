<?php

namespace SuiteCRM\Core\Modules\Users\Entity;

class OAuthPublicKey
{
    /**
     * @var integar
     */
    private $id;

    /**
     * @var string
     */
    private $public_key;

    /**
     * @var string
     */
    private $private_key;

    /**
     * @var string
     */
    private $client_id;

    /**
     * @var SuiteCRM\Core\Modules\Users\Entity\OAuthClient
     */
    private $client;

    /**
     * Get the value of Id
     *
     * @return integar
     */
    public function getId(): integar
    {
        return $this->id;
    }

    /**
     * Set the value of Id
     *
     * @param integar id
     *
     * @return self
     */
    public function setId(integar $id): self
    {
        $this->id = $id;

        return $this;
    }

    /**
     * Get the value of Public Key
     *
     * @return string
     */
    public function getPublicKey(): string
    {
        return $this->public_key;
    }

    /**
     * Set the value of Public Key
     *
     * @param string public_key
     *
     * @return self
     */
    public function setPublicKey($public_key): self
    {
        $this->public_key = $public_key;

        return $this;
    }

    /**
     * Get the value of Private Key
     *
     * @return string
     */
    public function getPrivateKey(): string
    {
        return $this->private_key;
    }

    /**
     * Set the value of Private Key
     *
     * @param string private_key
     *
     * @return self
     */
    public function setPrivateKey($private_key): self
    {
        $this->private_key = $private_key;

        return $this;
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
     * @return \YourNamespace\Entity\OAuthClient
     */
    public function getClient(): \YourNamespace\Entity\OAuthClient
    {
        return $this->client;
    }

}
