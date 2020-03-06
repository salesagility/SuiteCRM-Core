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

        $authController = new AuthenticationController();

        $PARAMS = [];

        $result = $authController->login($username, $password, $PARAMS);

        $this->close();

        return $result;
    }
}
