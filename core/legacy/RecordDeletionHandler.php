<?php

namespace SuiteCRM\Core\Legacy;

use App\Service\ListViewProviderInterface;
use App\Service\ModuleNameMapperInterface;
use App\Service\RecordDeletionProviderInterface;
use BeanFactory;

/**
 * Class ListViewHandler
 * @package SuiteCRM\Core\Legacy
 */
class RecordDeletionHandler extends LegacyHandler implements RecordDeletionProviderInterface
{
    public const HANDLER_KEY = 'delete-records';

    /**
     * @var ModuleNameMapperInterface
     */
    private $moduleNameMapper;

    /**
     * @var ListViewProviderInterface
     */
    private $listViewProvider;

    /**
     * RecordDeletionHandler constructor.
     * @param string $projectDir
     * @param string $legacyDir
     * @param string $legacySessionName
     * @param string $defaultSessionName
     * @param LegacyScopeState $legacyScopeState
     * @param ModuleNameMapperInterface $moduleNameMapper
     * @param ListViewProviderInterface $listViewProvider
     */
    public function __construct(
        string $projectDir,
        string $legacyDir,
        string $legacySessionName,
        string $defaultSessionName,
        LegacyScopeState $legacyScopeState,
        ModuleNameMapperInterface $moduleNameMapper,
        ListViewProviderInterface $listViewProvider
    )
    {
        parent::__construct($projectDir, $legacyDir, $legacySessionName, $defaultSessionName, $legacyScopeState);
        $this->moduleNameMapper = $moduleNameMapper;
        $this->listViewProvider = $listViewProvider;
    }

    /**
     * @inheritDoc
     */
    public function getHandlerKey(): string
    {
        return self::HANDLER_KEY;
    }


    /**
     * Delete records
     *
     * @param string $moduleName
     * @param array $ids
     * @return bool
     */
    public function deleteRecords(string $moduleName, array $ids = []): bool
    {
        $this->init();
        $this->startLegacyApp();

        $success = true;
        foreach ($ids as $id) {
            if (!$this->deleteRecord($moduleName, $id)) {
                $success = false;
            }
        }

        $this->close();

        return $success;
    }


    /**
     * @param string $moduleName
     * @param array $criteria
     * @param array $sort
     * @return bool
     */
    public function deleteRecordsFromCriteria(
        string $moduleName,
        array $criteria,
        array $sort
    ): bool
    {
        $this->init();
        $this->startLegacyApp();

        $listView = $this->listViewProvider->getListView(
            $this->moduleNameMapper->toFrontEnd($moduleName),
            $criteria,
            -1,
            // Hardcoded limit - passing 0 as limit throws a fatal
            100000,
            $sort
        );

        $success = true;
        foreach ($listView->getRecords() as $record) {
            if (!$this->deleteRecord($moduleName, $record['id'])) {
                $success = false;
            }
        }

        $this->close();

        return $success;
    }

    /**
     * @param string $moduleName
     * @param string $id
     * @return bool
     */
    protected function deleteRecord(string $moduleName, string $id): bool
    {
        $bean = BeanFactory::getBean($moduleName, $id);
        if ($bean && $bean->id && $bean->ACLAccess('Delete')) {
            $bean->mark_deleted($id);
            return true;
        }
        return false;
    }
}
