<?php

namespace App\Service;

use App\Entity\RecordList;

interface RecordListProviderInterface
{
    /**
     * Get list
     *
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
    ): RecordList;
}
