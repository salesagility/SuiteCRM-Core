<?php

namespace App\Service;

use App\Data\Entity\Record;
use Exception;

interface RecordProviderInterface
{
    /**
     * Get record
     * @param string $module
     * @param string $id
     * @return Record
     * @throws Exception
     */
    public function getRecord(string $module, string $id): Record;

    /**
     * Save record
     * @param Record $record
     * @return Record
     */
    public function saveRecord(Record $record): Record;
}
