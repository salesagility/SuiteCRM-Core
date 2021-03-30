<?php

namespace SuiteCRM\Core\Modules\Users\Entity;

use SuiteCRM\Core\Modules\Users\Entity\EncryptableField;

class OAuthUser extends EncryptableField
{
    /**
     * @var int
     */
    private $id;

    /**
     * @var string
     */
    private $username;

    /**
     * @var string
     */
    private $password;

    /**
     * @var string
     */
    private $session_id;

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
     * Set username
     *
     * @param $username
     * @return User
     */
    public function setUsername($username): User
    {
        $this->username = $username;

        return $this;
    }

    /**
     * Get username
     *
     * @return string
     */
    public function getUsername(): string
    {
        return $this->username;
    }

    /**
     * Set password
     *
     * @param string $password
     * @return User
     */
    public function setPassword($password): User
    {
        $this->password = $this->encryptField($password);

        return $this;
    }

    /**
     * Get password
     *
     * @return string
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    /**
     * Verify user's password
     *
     * @param string $password
     * @return Boolean
     */
    public function verifyPassword($password): bool
    {
        return $this->verifyEncryptedFieldValue($this->getPassword(), $password);
    }

    /**
     * Get OAuthUser object in array format
     *
     * @return array
     */
    public function toArray(): array
    {
        return [
            'user_id' => $this->id,
            'scope' => null,
        ];
    }
}
