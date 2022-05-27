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
use App\Engine\LegacyHandler\LegacyScopeState;
use App\SystemConfig\Service\SystemConfigProviderInterface;
use App\UserPreferences\Service\UserPreferencesProviderInterface;
use SugarBean;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/**
 * Class UserHandler
 * @package App\Authentication\LegacyHandler
 */
class UserHandler extends LegacyHandler
{
    public const HANDLER_KEY = 'user-handler';

    /**
     * @var SystemConfigProviderInterface
     */
    private $systemConfigProvider;

    /**
     * @var UserPreferencesProviderInterface
     */
    private $userPreferenceService;

    /**
     * LegacyHandler constructor.
     * @param string $projectDir
     * @param string $legacyDir
     * @param string $legacySessionName
     * @param string $defaultSessionName
     * @param LegacyScopeState $legacyScopeState
     * @param SessionInterface $session
     * @param SystemConfigProviderInterface $systemConfigProvider
     * @param UserPreferencesProviderInterface $userPreferenceService
     */
    public function __construct(
        string $projectDir,
        string $legacyDir,
        string $legacySessionName,
        string $defaultSessionName,
        LegacyScopeState $legacyScopeState,
        SessionInterface $session,
        SystemConfigProviderInterface $systemConfigProvider,
        UserPreferencesProviderInterface $userPreferenceService
    ) {
        parent::__construct(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScopeState,
            $session
        );
        $this->systemConfigProvider = $systemConfigProvider;
        $this->userPreferenceService = $userPreferenceService;
    }

    /**
     * @inheritDoc
     */
    public function getHandlerKey(): string
    {
        return self::HANDLER_KEY;
    }

    /**
     * @inheritDoc
     */
    public function getCurrentUser(): ?SugarBean
    {
        $this->init();
        $this->startLegacyApp();

        global $current_user;

        $this->close();

        return $current_user;
    }

    /**
     * Get current language
     * @return string
     */
    public function getCurrentLanguage(): string
    {
        $language = $this->getSessionLanguage();
        if (empty($language)) {
            $language = $this->getSystemLanguage();
        }

        return $language ?? 'en_us';
    }

    /**
     * Get current session language
     * @return string
     */
    public function getSessionLanguage(): string
    {
        return $this->session->get('ui_language', '');
    }

    /**
     * Set current session language
     */
    public function setSessionLanguage(string $language): void
    {
        $this->init();
        set_current_language($language);
        $this->close();

        $this->session->set('ui_language', $language);
    }

    /**
     * Get system default language
     * @return string
     */
    public function getSystemLanguage(): string
    {
        $language = 'en_us';

        $languageConfig = $this->systemConfigProvider->getSystemConfig('default_language');
        if ($languageConfig !== null) {
            $configLanguage = $languageConfig->getValue() ?? '';
            if ($configLanguage !== '') {
                $language = $configLanguage;
            }
        }

        return $language ?? 'en_us';
    }

    /**
     * Get user preferences language
     * @return string
     */
    public function getUserPreferencesLanguage(): string
    {
        $language = '';
        $languagePreference = $this->userPreferenceService->getUserPreference('global');
        if ($languagePreference !== null && !empty($languagePreference->getItems())) {
            $language = $languagePreference->getItems()['user_language'] ?? '';
        }

        return $language ?? '';
    }
}
