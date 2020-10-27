<?php

namespace App\Legacy\Data\PresetDataHandlers;

use App\Service\ModuleNameMapperInterface;
use BeanFactory;
use SubpanelCustomQueryPort;
use App\Legacy\LegacyHandler;
use App\Legacy\LegacyScopeState;

class SubpanelDataQueryHandler extends LegacyHandler
{
    public const HANDLER_KEY = 'subpanel-custom-query-handlers';

    /**
     * @var ModuleNameMapperInterface
     */
    private $moduleNameMapper;

    /**
     * @var SubpanelCustomQueryPort
     */
    private $queryHandler;

    /**
     * ListDataHandler constructor.
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
     * @inheritDoc
     */
    public function getType(): string
    {
        return 'subpanel';
    }

    /**
     * @inheritDoc
     */
    public function getQueries(string $parentModule, string $parentId, string $subpanel): array
    {
        $this->initQueryHandler();

        if ($parentModule) {
            $parentModule = $this->moduleNameMapper->toLegacy($parentModule);
        }

        $this->initController($parentModule);

        $parentBean = BeanFactory::getBean($parentModule, $parentId);

        return $this->queryHandler->getQueries($parentBean, $subpanel);
    }

    /**
     * @inheritDoc
     */
    public function runQuery(string $query): array
    {
        $this->initQueryHandler();

        return $this->queryHandler->runQuery($query);
    }

    protected function initQueryHandler(): void
    {

        if ($this->queryHandler !== null) {
            return;
        }

        /* @noinspection PhpIncludeInspection */
        require_once 'include/portability/Subpanels/SubpanelCustomQueryPort.php';

        $this->queryHandler = new SubpanelCustomQueryPort();
    }
}
