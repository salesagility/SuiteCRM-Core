<?php


namespace SuiteCRM\Core\Legacy;


use ApiPlatform\Core\Exception\ItemNotFoundException;
use App\Entity\AppStrings;

class AppStringsHandler extends LegacyHandler
{
    protected const MSG_LANGUAGE_NOT_FOUND = 'Not able to get language: ';

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
}