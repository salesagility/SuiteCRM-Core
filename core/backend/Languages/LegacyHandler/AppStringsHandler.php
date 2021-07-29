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

namespace App\Languages\LegacyHandler;

use ApiPlatform\Core\Exception\ItemNotFoundException;
use App\Engine\LegacyHandler\LegacyHandler;
use App\Languages\Entity\AppStrings;

class AppStringsHandler extends LegacyHandler
{
    protected const MSG_LANGUAGE_NOT_FOUND = 'Not able to get language: ';
    public const HANDLER_KEY = 'app-strings';

    protected $injectedModuleLanguages = [
        'Users' => [
            'LBL_LOGOUT',
            'LBL_LOGIN_BUTTON_LABEL',
            'LBL_LOGIN_BUTTON_TITLE',
            'LBL_LOGIN_FORGOT_PASSWORD',
            'LBL_LOGIN_SUBMIT',
            'LBL_USER_NAME',
            'ERR_INVALID_PASSWORD',
            'LBL_PASSWORD',
            'LBL_LANGUAGE',
            'LBL_LOGIN_FORGOT_PASSWORD',
            'LBL_EMAIL',
            'ERR_MISSING_REQUIRED_FIELDS',
            'LBL_RECOVER_PASSWORD_SUCCESS',
            'LBL_SESSION_EXPIRED',
            'LBL_LOGOUT_SUCCESS'
        ]
    ];

    /**
     * @inheritDoc
     */
    public function getHandlerKey(): string
    {
        return self::HANDLER_KEY;
    }

    /**
     * Get app strings for given $language
     * @param $language
     * @return AppStrings|null
     */
    public function getAppStrings(string $language): ?AppStrings
    {
        if (empty($language)) {
            return null;
        }

        $this->init();

        $enabledLanguages = get_languages();

        if (empty($enabledLanguages) || !array_key_exists($language, $enabledLanguages)) {
            throw new ItemNotFoundException(self::MSG_LANGUAGE_NOT_FOUND . "'$language'");
        }

        $appStringsArray = return_application_language($language);

        if (empty($appStringsArray)) {
            throw new ItemNotFoundException(self::MSG_LANGUAGE_NOT_FOUND . "'$language'");
        }

        foreach ($this->injectedModuleLanguages as $module => $languageKeys) {
            $this->injectModuleLanguage($language, $module, $languageKeys, $appStringsArray);
        }

        $appStringsArray = array_merge(load_install_language($language), $appStringsArray);

        $appStringsArray = $this->removeEndingColon($appStringsArray);

        $appStrings = new AppStrings();
        $appStrings->setId($language);
        $appStrings->setItems($appStringsArray);

        $this->close();

        return $appStrings;
    }

    /**
     * Retrieve and inject language keys from a module language
     * @param string $language
     * @param string $module
     * @param array $languageKeys
     * @param array $appStringsArray reference
     */
    protected function injectModuleLanguage(
        string $language,
        string $module,
        array $languageKeys,
        array &$appStringsArray
    ): void {
        if (empty($language) || empty($module) || empty($languageKeys)) {
            return;
        }

        $moduleLanguage = return_module_language($language, $module, true);

        foreach ($languageKeys as $key) {

            if (isset($moduleLanguage[$key])) {
                $appStringsArray[$key] = $moduleLanguage[$key];
            }
        }

        return;
    }

    /**
     * @param array $appStringsArray
     * @return array
     */
    protected function removeEndingColon(array $appStringsArray): array
    {
        $appStringsArray = array_map(static function ($label) {
            if (is_string($label)) {
                return preg_replace('/:$/', '', $label);
            }

            return $label;
        }, $appStringsArray);

        return $appStringsArray;
    }
}
