<?php


namespace SuiteCRM\Core\Legacy;


use ApiPlatform\Core\Exception\ItemNotFoundException;
use App\Entity\ModStrings;
use App\Service\ModuleNameMapper;

class ModStringsHandler extends LegacyHandler
{
    protected const MSG_LANGUAGE_NOT_FOUND = 'Not able to get language: ';

    /**
     * @var ModuleNameMapper
     */
    private $moduleNameMapper;

    /**
     * SystemConfigHandler constructor.
     * @param string $projectDir
     * @param string $legacyDir
     * @param string $legacySessionName
     * @param string $defaultSessionName
     * @param ModuleNameMapper $moduleNameMapper
     */
    public function __construct(
        string $projectDir,
        string $legacyDir,
        string $legacySessionName,
        string $defaultSessionName,
        ModuleNameMapper $moduleNameMapper
    ) {
        parent::__construct($projectDir, $legacyDir, $legacySessionName, $defaultSessionName);
        $this->moduleNameMapper = $moduleNameMapper;
    }

    /**
     * Get mod strings for given $language
     * @param $language
     * @return ModStrings|null
     */
    public function getModStrings(string $language): ?ModStrings
    {
        $this->init();

        if (empty($language)) {
            return null;
        }

        $enabledLanguages = get_languages();

        if (empty($enabledLanguages) || !array_key_exists($language, $enabledLanguages)) {
            throw new ItemNotFoundException(self::MSG_LANGUAGE_NOT_FOUND . "'$language'");
        }

        global $moduleList;

        $allModStringsArray = [];
        foreach ($moduleList as $module) {
            $frontendName = $this->moduleNameMapper->toFrontEnd($module);
            $allModStringsArray[$frontendName] = return_module_language($language, $module);
        }


        if (empty($allModStringsArray)) {
            throw new ItemNotFoundException(self::MSG_LANGUAGE_NOT_FOUND . "'$language'");
        }


        $modStrings = new ModStrings();
        $modStrings->setId($language);
        $modStrings->setItems($allModStringsArray);

        $this->close();

        return $modStrings;
    }
}