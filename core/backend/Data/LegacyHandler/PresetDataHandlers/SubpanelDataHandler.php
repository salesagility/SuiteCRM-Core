<?php

namespace App\Data\LegacyHandler\PresetDataHandlers;

use App\Data\LegacyHandler\ListData;
use App\Data\LegacyHandler\PresetListDataHandlerInterface;
use App\Data\LegacyHandler\RecordMapper;
use App\LegacyHandler;
use App\LegacyScopeState;
use App\Service\ModuleNameMapperInterface;
use BeanFactory;
use SubpanelDataPort;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

class SubpanelDataHandler extends LegacyHandler implements PresetListDataHandlerInterface
{
    public const HANDLER_KEY = 'subpanel-data-handlers';

    /**
     * @var ModuleNameMapperInterface
     */
    private $moduleNameMapper;

    /**
     * @var RecordMapper
     */
    private $recordMapper;

    /**
     * ListDataHandler constructor.
     * @param string $projectDir
     * @param string $legacyDir
     * @param string $legacySessionName
     * @param string $defaultSessionName
     * @param LegacyScopeState $legacyScopeState
     * @param ModuleNameMapperInterface $moduleNameMapper
     * @param RecordMapper $recordMapper
     */
    public function __construct(
        string $projectDir,
        string $legacyDir,
        string $legacySessionName,
        string $defaultSessionName,
        LegacyScopeState $legacyScopeState,
        ModuleNameMapperInterface $moduleNameMapper,
        RecordMapper $recordMapper,
        SessionInterface $session
    ) {
        parent::__construct($projectDir, $legacyDir, $legacySessionName, $defaultSessionName, $legacyScopeState, $session);
        $this->moduleNameMapper = $moduleNameMapper;
        $this->recordMapper = $recordMapper;
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
    public function fetch(
        string $module,
        array $criteria = [],
        int $offset = -1,
        int $limit = -1,
        array $sort = []
    ): ListData {

        $subpanel = $criteria['preset']['params']['subpanel'] ?? '';
        $parentModule = $criteria['preset']['params']['parentModule'] ?? '';
        $parentId = $criteria['preset']['params']['parentId'] ?? '';

        if ($parentModule) {
            $parentModule = $this->moduleNameMapper->toLegacy($parentModule);
        }

        $this->initController($parentModule);

        $parentBean = BeanFactory::getBean($parentModule, $parentId);

        /* @noinspection PhpIncludeInspection */
        require_once 'include/portability/Subpanels/SubpanelDataPort.php';

        $data = (new SubpanelDataPort())->fetch(
            $parentBean,
            $subpanel,
            $offset,
            $limit,
            $sort['orderBy'] ?? '',
            $sort['sortOrder'] ?? ''
        );

        $listData = new ListData();
        $listData->setOffsets($data['offsets'] ?? []);
        $listData->setOrdering($data['ordering'] ?? []);
        $listData->setRecords($this->recordMapper->mapRecords($data['data'] ?? []));

        return $listData;
    }
}
