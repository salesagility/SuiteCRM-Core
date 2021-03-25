<?php

namespace App\Data\LegacyHandler;

use App\Engine\LegacyHandler\LegacyHandler;
use App\Engine\LegacyHandler\LegacyScopeState;
use App\Data\Entity\RecordList;
use App\Service\ModuleNameMapperInterface;
use App\Service\RecordListProviderInterface;
use InvalidArgumentException;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/**
 * Class RecordListHandler
 * @package App\Legacy
 */
class RecordListHandler extends LegacyHandler implements RecordListProviderInterface
{
    public const HANDLER_KEY = 'list-view';

    /**
     * @var ModuleNameMapperInterface
     */
    private $moduleNameMapper;

    /**
     * @var ListDataHandler
     */
    private $listDataHandler;

    /**
     * @var PresetListDataHandlers
     */
    private $presetHandlers;

    /**
     * SystemConfigHandler constructor.
     * @param string $projectDir
     * @param string $legacyDir
     * @param string $legacySessionName
     * @param string $defaultSessionName
     * @param LegacyScopeState $legacyScopeState
     * @param ModuleNameMapperInterface $moduleNameMapper
     * @param ListDataHandler $listDataHandler
     * @param PresetListDataHandlers $presetHandlers
     */
    public function __construct(
        string $projectDir,
        string $legacyDir,
        string $legacySessionName,
        string $defaultSessionName,
        LegacyScopeState $legacyScopeState,
        ModuleNameMapperInterface $moduleNameMapper,
        ListDataHandler $listDataHandler,
        PresetListDataHandlers $presetHandlers,
        SessionInterface $session
    ) {
        parent::__construct($projectDir, $legacyDir, $legacySessionName, $defaultSessionName, $legacyScopeState, $session);
        $this->moduleNameMapper = $moduleNameMapper;
        $this->listDataHandler = $listDataHandler;
        $this->presetHandlers = $presetHandlers;
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
     * @param array $criteria
     * @param int $offset
     * @param int $limit
     * @param array $sort
     * @return RecordList
     */
    public function getList(
        string $moduleName,
        array $criteria = [],
        int $offset = -1,
        int $limit = -1,
        array $sort = []
    ): RecordList {
        $this->init();
        $this->startLegacyApp();

        $moduleName = $this->validateModuleName($moduleName);

        $listData = $this->getData($moduleName, $criteria, $offset, $limit, $sort);

        if ($this->currentPageHasNoRecords($listData)) {
            $listData = $this->getData($moduleName, $criteria, 0, $limit, $sort);
        }

        $recordList = new RecordList();
        $recordList->setId($moduleName);

        $records = [];
        foreach ($listData->getRecords() as $record) {
            $records[] = $record->toArray();
        }

        $recordList->setRecords($records);
        $recordList->setMeta([
            'offsets' => $listData->getOffsets(),
            'ordering' => $listData->getOrdering()
        ]);

        $this->close();

        return $recordList;
    }

    /**
     * @param $moduleName
     * @return string
     */
    private function validateModuleName($moduleName): string
    {
        $moduleName = $this->moduleNameMapper->toLegacy($moduleName);

        if (!$this->moduleNameMapper->isValidModule($moduleName)) {
            throw new InvalidArgumentException('Invalid module name: ' . $moduleName);
        }

        return $moduleName;
    }

    /**
     * @param string $module
     * @param array $criteria
     * @param int $offset
     * @param int $limit
     * @param array $sort
     * @return ListData
     */
    protected function getData(
        string $module,
        array $criteria = [],
        int $offset = -1,
        int $limit = -1,
        array $sort = []
    ): ListData {
        if (isset($criteria['preset'])) {
            $type = $criteria['preset']['type'] ?? '';

            return $this->presetHandlers->get($type)->fetch($module, $criteria, $offset, $limit, $sort);
        }

        return $this->listDataHandler->fetch($module, $criteria, $offset, $limit, $sort);
    }

    /**
     * @param ListData $recordList
     * @return bool
     */
    protected function currentPageHasNoRecords(ListData $recordList): bool
    {
        $totalRecords = (int)($recordList->getOffsets()['total'] ?? 0);
        $current = (int)($recordList->getOrdering()['current'] ?? 0);

        return $totalRecords && $current && $current >= $totalRecords;
    }

}
