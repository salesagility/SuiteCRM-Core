<?php

namespace App\Legacy;

use App\Service\RecordListProviderInterface;
use App\Service\ModuleNameMapperInterface;
use App\Service\RecordDeletionServiceInterface;
use BeanFactory;

/**
 * Class ListViewHandler
 * @package App\Legacy
 */
class RecordDeletionHandler extends LegacyHandler implements RecordDeletionServiceInterface
{
    public const HANDLER_KEY = 'delete-records';

    /**
     * @var ModuleNameMapperInterface
     */
    private $moduleNameMapper;

    /**
     * @var RecordListProviderInterface
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
     * @param RecordListProviderInterface $listViewProvider
     */
    public function __construct(
        string $projectDir,
        string $legacyDir,
        string $legacySessionName,
        string $defaultSessionName,
        LegacyScopeState $legacyScopeState,
        ModuleNameMapperInterface $moduleNameMapper,
        RecordListProviderInterface $listViewProvider
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
     * Delete record
     *
     * @param string $moduleName
     * @param string $id
     * @return bool
     */
    public function deleteRecord(string $moduleName, string $id): bool
    {
        $this->init();
        $this->startLegacyApp();

        $success = true;
        if (!$this->delete($moduleName, $id)) {
            $success = false;
        }

        $this->close();

        return $success;
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
            if (!$this->delete($moduleName, $id)) {
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

        $listView = $this->listViewProvider->getList(
            $this->moduleNameMapper->toFrontEnd($moduleName),
            $criteria,
            -1,
            // Hardcoded limit - passing 0 as limit throws a fatal
            100000,
            $sort
        );

        $success = true;
        foreach ($listView->getRecords() as $record) {
            if (!$this->delete($moduleName, $record['id'])) {
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
    protected function delete(string $moduleName, string $id): bool
    {
        // NOTE: Do not use BeanFactory::getBean($moduleName, $id) with mark_deleted
        // may cause errors when there are related records.
        $bean = BeanFactory::newBean($moduleName);
        $bean->retrieve($id);
        if ($bean && $bean->id && $bean->ACLAccess('Delete')) {
            $bean->mark_deleted($id);

            return true;
        }

        return false;
    }
}
