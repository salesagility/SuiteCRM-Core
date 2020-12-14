<?php

namespace App\Legacy;

use App\Entity\FieldDefinition;
use App\Service\FieldDefinitionsProviderInterface;
use App\Service\ModuleNameMapperInterface;
use Exception;
use SugarView;

/**
 * Class FieldDefinitionsHandler
 * @package App\Legacy
 */
class FieldDefinitionsHandler extends LegacyHandler implements FieldDefinitionsProviderInterface
{
    public const HANDLER_KEY = 'field-definitions';

    /**
     * @var ModuleNameMapperInterface
     */
    private $moduleNameMapper;

    /**
     * SystemConfigHandler constructor.
     * @param string $projectDir
     * @param string $legacyDir
     * @param string $legacySessionName
     * @param string $defaultSessionName
     * @param LegacyScopeState $legacyScopeState
     * @param ModuleNameMapperInterface $moduleNameMapper
     */
    public function __construct(
        string $projectDir,
        string $legacyDir,
        string $legacySessionName,
        string $defaultSessionName,
        LegacyScopeState $legacyScopeState,
        ModuleNameMapperInterface $moduleNameMapper
    ) {
        parent::__construct($projectDir, $legacyDir, $legacySessionName, $defaultSessionName, $legacyScopeState);
        $this->moduleNameMapper = $moduleNameMapper;
    }

    /**
     * @inheritDoc
     */
    public function getHandlerKey(): string
    {
        return self::HANDLER_KEY;
    }

    /**
     * @param string $moduleName
     * @return FieldDefinition
     * @throws Exception
     */
    public function getVardef(string $moduleName): FieldDefinition
    {
        $this->init();

        $legacyModuleName = $this->moduleNameMapper->toLegacy($moduleName);

        $vardefs = new FieldDefinition();
        $vardefs->setId($moduleName);
        $vardefs->setVardef($this->getDefinitions($legacyModuleName));

        $this->close();

        return $vardefs;
    }

    /**
     * Get legacy definitions
     * @param string $legacyModuleName
     * @return array|mixed
     */
    protected function getDefinitions(string $legacyModuleName)
    {
        $sugarView = new SugarView();
        $data = $sugarView->getVardefsData($legacyModuleName);

        return $data[0][$legacyModuleName] ?? [];
    }
}
