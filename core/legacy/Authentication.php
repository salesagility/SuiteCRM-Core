<?php

namespace SuiteCRM\Core\Legacy;

use AuthenticationController;
use Exception;

/**
 * Class Authentication
 */
class Authentication extends LegacyHandler
{
    protected $config;

    /**
     * Set the config
     *
     * @param $config
     * @return $this
     */
    public function setConfig($config): self
    {
        $this->config = $config;

        return $this;
    }

    /**
     * Legacy login
     *
     * @param $username
     * @param $password
     * @param $grant_type
     *
     * @return bool
     * @throws Exception
     */
    public function login($username, $password, $grant_type = 'password'): bool
    {
        $this->init();

        $authController = $this->getAuthenticationController();

        $PARAMS = [];

        $result = $authController->login($username, $password, $PARAMS);

        $this->close();

        return $result;
    }

    /**
     * Legacy logout
     */
    public function logout(): void
    {
        $this->init();

        $authController = $this->getAuthenticationController();

        $authController->logout(false, false, false);

        $this->close();
    }


    /**
     * Check if legacy suite session is active
     * @return bool
     */
    public function checkSession(): bool
    {
        $this->init();

        $authController = $this->getAuthenticationController();

        /** @var bool $result */
        $result = $authController->sessionAuthenticate();

        $this->close();

        return $result;
    }

    /**
     * Get auth controller
     * @return AuthenticationController
     */
    protected function getAuthenticationController(): AuthenticationController
    {
        return new AuthenticationController();
    }
}
