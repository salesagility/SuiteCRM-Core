<?php

namespace App\Service;

use App\Entity\ListView;

interface ListViewProviderInterface
{
    /**
     * Get ListView
     *
     * @param string $moduleName
     * @param array $criteria
     * @param int $offset
     * @param int $limit
     * @param array $sort
     * @return ListView
     */
    public function getListView(
        string $moduleName,
        array $criteria = [],
        int $offset = -1,
        int $limit = -1,
        array $sort = []
    ): ListView;
}
