<?php

namespace App\Data\LegacyHandler\PresetDataHandlers;

use App\Engine\LegacyHandler\LegacyHandler;
use App\Engine\LegacyHandler\LegacyScopeState;
use App\Service\ModuleNameMapperInterface;
use BeanFactory;
use SubpanelCustomQueryPort;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

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
     * @param SessionInterface $session
     */
    public function __construct(
        string $projectDir,
        string $legacyDir,
        string $legacySessionName,
        string $defaultSessionName,
        LegacyScopeState $legacyScopeState,
        ModuleNameMapperInterface $moduleNameMapper,
        SessionInterface $session
    ) {
        parent::__construct($projectDir, $legacyDir, $legacySessionName, $defaultSessionName, $legacyScopeState, $session);
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

    protected function initQueryHandler(): void
    {

        if ($this->queryHandler !== null) {
            return;
        }

        /* @noinspection PhpIncludeInspection */
        require_once 'include/portability/Subpanels/SubpanelCustomQueryPort.php';

        $this->queryHandler = new SubpanelCustomQueryPort();
    }

    /**
     * @param string $query
     * @return array
     */
    public function fetchRow(string $query): array
    {
        $this->initQueryHandler();

        return $this->queryHandler->fetchRow($query);
    }

    /**
     * @param string $query
     * @return array
     */
    public function fetchAll(string $query): array
    {
        $this->initQueryHandler();

        return $this->queryHandler->fetchAll($query);
    }
}
