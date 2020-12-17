<?php

namespace App\Legacy\Data;

use SugarBean;

class ListDataQueryHandler extends BaseListDataHandler
{
    /**
     * @param SugarBean $bean
     * @param array $criteria
     * @param array $sort
     * @return array
     */
    public function getQuery(SugarBean $bean, array $criteria = [], array $sort = []): array
    {
        $type = 'advanced';

        $legacyCriteria = $this->mapCriteria($criteria, $sort, $type);

        [$params, $where, $filter_fields] = $this->prepareQueryData($type, $bean, $legacyCriteria);

        return $this->getListDataPort()->getQueryParts($bean, $where, $filter_fields, $params);
    }

    /**
     * @param SugarBean $bean
     * @param array $queryParts
     * @param int $offset
     * @param int $limit
     * @return array
     */
    public function runQuery(SugarBean $bean, array $queryParts = [], $offset = -1, $limit = -1): array
    {
        return $this->getListDataPort()->runCustomQuery($bean, $queryParts, $offset, $limit);
    }
}
