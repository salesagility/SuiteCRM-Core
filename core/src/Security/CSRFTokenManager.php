<?php

namespace App\Security;

use Symfony\Component\Security\Csrf\CsrfToken;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

/**
 * Class CSRFTokenManager
 * @package App\Security
 */
class CSRFTokenManager
{
    /**
     * @var CsrfTokenManagerInterface
     */
    protected $csrfTokenManager;

    /**
     * @var string
     */
    protected $tokenId;

    /**
     * CSRFTokenManager constructor.
     * @param CsrfTokenManagerInterface $csrfTokenManager
     * @param $tokenId
     */
    public function __construct(CsrfTokenManagerInterface $csrfTokenManager, $tokenId)
    {
        $this->csrfTokenManager = $csrfTokenManager;
        $this->tokenId = $tokenId;
    }

    /**
     * @return CsrfToken
     */
    public function getToken(): CsrfToken
    {
        return $this->csrfTokenManager->getToken($this->tokenId);
    }

    /**
     * @return CsrfToken
     */
    public function refreshToken(): CsrfToken
    {
        return $this->csrfTokenManager->refreshToken($this->tokenId);
    }

    /**
     * @return string|null
     */
    public function removeToken(): ?string
    {
        return $this->csrfTokenManager->removeToken($this->tokenId);
    }

    /**
     * @param $value
     * @return bool
     */
    public function isTokenValid($value): bool
    {
        $csrfToken = new CsrfToken($this->tokenId, $value);

        return $this->csrfTokenManager->isTokenValid($csrfToken);
    }
}
