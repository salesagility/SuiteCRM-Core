<?php

namespace App\FieldDefinitions\LegacyHandler;

use App\Engine\LegacyHandler\LegacyScopeState;
use App\FieldDefinitions\Entity\FieldDefinition;
use App\Engine\LegacyHandler\LegacyHandler;
use App\Service\FieldDefinitionsProviderInterface;
use App\Service\ModuleNameMapperInterface;
use Exception;
use SugarView;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

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
     * @var FieldDefinitionMappers
     */
    private $mappers;

    /**
     * SystemConfigHandler constructor.
     * @param string $projectDir
     * @param string $legacyDir
     * @param string $legacySessionName
     * @param string $defaultSessionName
     * @param LegacyScopeState $legacyScopeState
     * @param ModuleNameMapperInterface $moduleNameMapper
     * @param FieldDefinitionMappers $mappers
     * @param SessionInterface $session
     */
    public function __construct(
        string $projectDir,
        string $legacyDir,
        string $legacySessionName,
        string $defaultSessionName,
        LegacyScopeState $legacyScopeState,
        ModuleNameMapperInterface $moduleNameMapper,
        FieldDefinitionMappers $mappers,
        SessionInterface $session
    ) {
        parent::__construct($projectDir, $legacyDir, $legacySessionName, $defaultSessionName, $legacyScopeState,
            $session);
        $this->moduleNameMapper = $moduleNameMapper;
        $this->mappers = $mappers;
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

        $mappers = $this->mappers->get($moduleName);

        foreach ($mappers as $mapper) {
            $mapper->map($vardefs);
        }

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
