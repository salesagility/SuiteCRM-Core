<?php

namespace App\Data\Service;

interface RecordDeletionServiceInterface
{
    /**
     * Delete record
     *
     * @param string $moduleName
     * @param string $id
     * @return bool
     */
    public function deleteRecord(string $moduleName, string $id): bool;

    /**
     * Delete records
     *
     * @param string $moduleName
     * @param array $ids
     * @return bool
     */
    public function deleteRecords(string $moduleName, array $ids = []): bool;

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
    ): bool;
}
