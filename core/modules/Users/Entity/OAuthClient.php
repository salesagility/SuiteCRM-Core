<?php

namespace SuiteCRM\Core\Modules\Users\Entity;

use SuiteCRM\Core\Modules\Users\Entity\EncryptableField;

class OAuthClient extends EncryptableField
{
    /**
     * @var int
     */
    private $id;

    /**
     * @var string
     */
    private $client_identifier;

    /**
     * @var string
     */
    private $client_secret;

    /**
     * @var string
     */
    private $redirect_uri = '';

    /**
     * dds
     * @var [type]
     */
    private $status;

    /**
     * OAuthClient constructor.
     * @param array $row
     * @throws \Exception
     */
    public function __construct($row = [])
    {
        foreach ($row as $key => $val) {
            if (property_exists($this, $key)) {
                $this->{$key} = $val;
            }
        }

        if ($this->id == 0) {
            $this->created_date = new \DateTime();
        }

        $this->modified_date = new \DateTime();
    }

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
     * Set client_identifier
     *
     * @param string $clientIdentifier
     * @return OAuthClient
     */
    public function setClientIdentifier($clientIdentifier): OAuthClient
    {
        $this->client_identifier = $clientIdentifier;

        return $this;
    }

    /**
     * Get client_identifier
     *
     * @return string
     */
    public function getClientIdentifier(): string
    {
        return $this->client_identifier;
    }

    /**
     * Set client_secret
     *
     * @param string $clientSecret
     * @return OAuthClient
     */
    public function setClientSecret($clientSecret): OAuthClient
    {
        $this->client_secret = $this->encryptField($clientSecret);

        return $this;
    }

    /**
     * Get client_secret
     *
     * @return string
     */
    public function getClientSecret(): string
    {
        return $this->client_secret;
    }

    /**
     * Verify client's secret
     *
     * @param $clientSecret
     * @return Boolean
     */
    public function verifyClientSecret($clientSecret): bool
    {
        return $this->verifyEncryptedFieldValue($this->getClientSecret(), $clientSecret);
    }

    /**
     * Set redirect_uri
     *
     * @param string $redirectUri
     * @return OAuthClient
     */
    public function setRedirectUri($redirectUri): OAuthClient
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
     * @return array
     */
    public function toArray(): array
    {
        return [
            'client_id' => $this->client_identifier,
            'client_secret' => $this->client_secret,
            'redirect_uri' => $this->redirect_uri,
        ];
    }

    /**
     * Set the value of Id
     *
     * @param int id
     *
     * @return self
     */
    public function setId($id): self
    {
        $this->id = $id;

        return $this;
    }

    /**
     * Get the value of Status
     *
     * @return mixed
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * Set the value of Status
     *
     * @param mixed status
     *
     * @return self
     */
    public function setStatus($status): self
    {
        $this->status = $status;

        return $this;
    }

}
