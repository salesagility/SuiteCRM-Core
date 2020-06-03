<?php

namespace App\Service;

use App\Entity\ListView;

interface ListViewProviderInterface
{
    /**
     * Get ListView
     * @param string $moduleName
     * @return ListView
     */
    public function getListView(string $moduleName): ListView;
}
