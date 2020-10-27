<?php


namespace App\Legacy;


use ApiPlatform\Core\Exception\ItemNotFoundException;
use App\Entity\AppListStrings;

class AppListStringsHandler extends LegacyHandler implements AppListStringsProviderInterface
{
    protected const MSG_LANGUAGE_NOT_FOUND = 'Not able to get language: ';
    public const HANDLER_KEY = 'app-list-strings';

    /**
     * @inheritDoc
     */
    public function getHandlerKey(): string
    {
        return self::HANDLER_KEY;
    }

    /**
     * Get app list strings for given $language
     * @param $language
     * @return AppListStrings|null
     */
    public function getAppListStrings(string $language): ?AppListStrings
    {
        if (empty($language)) {
            return null;
        }

        $this->init();

        $enabledLanguages = get_languages();

        if (empty($enabledLanguages) || !array_key_exists($language, $enabledLanguages)) {
            throw new ItemNotFoundException(self::MSG_LANGUAGE_NOT_FOUND . "'$language'");
        }

        $appListStringsArray = return_app_list_strings_language($language);

        if (empty($appListStringsArray)) {
            throw new ItemNotFoundException(self::MSG_LANGUAGE_NOT_FOUND . "'$language'");
        }

        $appListStrings = new AppListStrings();
        $appListStrings->setId($language);
        $appListStrings->setItems($appListStringsArray);

        $this->close();

        return $appListStrings;
    }
}
