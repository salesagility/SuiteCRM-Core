<?php
/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2021 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */

namespace App\Authentication\LegacyHandler;

use App\Engine\LegacyHandler\LegacyHandler;
use App\Install\Service\InstallationUtilsTrait;
use AuthenticationController;
use Exception;

/**
 * Class Authentication
 */
class Authentication extends LegacyHandler
{
    use InstallationUtilsTrait;

    public const HANDLER_KEY = 'authentication';
    protected $config;

    /**
     * @inheritDoc
     */
    public function getHandlerKey(): string
    {
        return self::HANDLER_KEY;
    }

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
     *
     * @return bool
     * @throws Exception
     */
    public function login($username, $password): bool
    {
        $this->init();

        global $mod_strings, $current_language;

        $mod_strings = return_module_language($current_language, 'Users');

        $authController = $this->getAuthenticationController();

        $PARAMS = [
            'ignoreTimeZoneRedirect' => true,
        ];

        $result = $authController->login($username, $password, $PARAMS);

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
     * Check if suite app is installed
     * @return bool
     */
    public function getAppInstallStatus(): bool
    {
        $this->init();

        /** @var bool $result */
        $result = $this->isAppInstalled($this->legacyDir);

        $this->close();

        return $result;
    }

    /**
     * Check if suite app is installed but locked
     * @return bool
     */
    public function getAppInstallerLockStatus(): bool
    {
        $this->init();

        /** @var bool $result */
        $result = $this->isAppInstallerLocked($this->legacyDir);

        $this->close();

        return $result;
    }
}
