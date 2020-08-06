<?php

namespace App\Service;

use App\Entity\RecordView;
use Exception;

interface RecordViewProviderInterface
{
    /**
     * Get record
     * @param string $module
     * @param string $id
     * @return RecordView
     * @throws Exception
     */
    public function getRecord(string $module, string $id): RecordView;
}
