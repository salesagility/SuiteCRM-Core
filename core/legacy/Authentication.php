<?php

namespace SuiteCRM\Core\Legacy;

use SuiteCRM\Core\Base\Config\ParameterCollection;

use SuiteCRM\Core\Legacy\LegacyHandler;

/**
 * Class Authentication
 * @package SuiteCRM\Core\Legacy
 */
class Authentication extends LegacyHandler
{
    /**
     * Set the config
     *
     * @param ParameterCollection $config
     * @return $this
     */
    public function setConfig(ParameterCollection $config): self
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
     * @return boolean
     * @throws \Exception
     */
    public function login($username, $password, $grant_type = 'password'): bool
    {
        if ($this->runLegacyEntryPoint()) {
            $authController = new \AuthenticationController();

            $PARAMS = [];

            return $authController->login($username, $password, $PARAMS);
        }

        throw new \RuntimeException('Running legacy entry point failed');
    }
}
