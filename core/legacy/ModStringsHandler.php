<?php


namespace App\Legacy;


use ApiPlatform\Core\Exception\ItemNotFoundException;
use App\Entity\ModStrings;
use App\Service\ModuleNameMapperInterface;
use App\Service\ModuleRegistryInterface;

class ModStringsHandler extends LegacyHandler
{
    protected const MSG_LANGUAGE_NOT_FOUND = 'Not able to get language: ';
    public const HANDLER_KEY = 'mod-strings';

    protected static $extraModules = [
        'SecurityGroups',
        'Bugs'
    ];

    /**
     * @var ModuleNameMapperInterface
     */
    private $moduleNameMapper;

    /**
     * @var ModuleRegistryInterface
     */
    private $moduleRegistry;

    /**
     * SystemConfigHandler constructor.
     * @param string $projectDir
     * @param string $legacyDir
     * @param string $legacySessionName
     * @param string $defaultSessionName
     * @param LegacyScopeState $legacyScopeState
     * @param ModuleNameMapperInterface $moduleNameMapper
     * @param ModuleRegistryInterface $moduleRegistry
     */
    public function __construct(
        string $projectDir,
        string $legacyDir,
        string $legacySessionName,
        string $defaultSessionName,
        LegacyScopeState $legacyScopeState,
        ModuleNameMapperInterface $moduleNameMapper,
        ModuleRegistryInterface $moduleRegistry
    ) {
        parent::__construct($projectDir, $legacyDir, $legacySessionName, $defaultSessionName, $legacyScopeState);
        $this->moduleNameMapper = $moduleNameMapper;
        $this->moduleRegistry = $moduleRegistry;
    }

    /**
     * @inheritDoc
     */
    public function getHandlerKey(): string
    {
        return self::HANDLER_KEY;
    }

    /**
     * Get mod strings for given $language
     * @param $language
     * @return ModStrings|null
     */
    public function getModStrings(string $language): ?ModStrings
    {
        if (empty($language)) {
            return null;
        }

        $this->init();

        //change legacy language
        set_current_language($language);

        $enabledLanguages = get_languages();

        if (empty($enabledLanguages) || !array_key_exists($language, $enabledLanguages)) {
            throw new ItemNotFoundException(self::MSG_LANGUAGE_NOT_FOUND . "'$language'");
        }

        $modules = $this->moduleRegistry->getUserAccessibleModules();

        $modules = array_merge($modules, self::$extraModules);

        $allModStringsArray = [];
        foreach ($modules as $module) {
            $frontendName = $this->moduleNameMapper->toFrontEnd($module);
            $moduleStrings = return_module_language($language, $module);
            if (!empty($moduleStrings)) {
                $moduleStrings = $this->removeEndingColon($moduleStrings);
            }
            $allModStringsArray[$frontendName] = $moduleStrings;
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

    /**
     * @param array $stringArray
     * @return array
     */
    protected function removeEndingColon(array $stringArray): array
    {
        $stringArray = array_map(static function ($label) {
            if (is_string($label)) {
                return preg_replace('/:$/', '', $label);
            }

            return $label;
        }, $stringArray);

        return $stringArray;
    }
}
