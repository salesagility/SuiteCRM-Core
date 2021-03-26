<?php

namespace App\Tests\_mock\Mock\core\legacy\Data;

use App\Data\LegacyHandler\ListDataQueryHandler;
use SugarBean;

class ListDataQueryHandlerMock extends ListDataQueryHandler
{
    /**
     * @inheritDoc
     */
    public function getQuery(SugarBean $bean, array $criteria = [], array $sort = []): array
    {
        return [];
    }

    /**
     * @inheritDoc
     */
    public function runQuery(SugarBean $bean, array $queryParts = [], $offset = -1, $limit = -1): array
    {
        return [];
    }
}
