<?php

namespace App\Data\LegacyHandler;

class ListDataHandler extends BaseListDataHandler implements ListDataHandlerInterface
{
    /**
     * @param string $module
     * @param array $criteria
     * @param int $offset
     * @param int $limit
     * @param array $sort
     * @return ListData
     */
    public function fetch(
        string $module,
        array $criteria = [],
        int $offset = -1,
        int $limit = -1,
        array $sort = []
    ): ListData {
        $type = 'advanced';

        $bean = $this->getBean($module);

        $legacyCriteria = $this->mapCriteria($criteria, $sort, $type);

        [$params, $where, $filter_fields] = $this->prepareQueryData($type, $bean, $legacyCriteria);

        $resultData = $this->getListDataPort()->get($bean, $where, $offset, $limit, $filter_fields, $params);

        return $this->buildListData($resultData);
    }

    /**
     * @param array $resultData
     * @return ListData
     */
    protected function buildListData(array $resultData): ListData
    {
        $listData = new ListData();
        $records = $this->recordMapper->mapRecords($resultData['data'] ?? []);
        $listData->setRecords($records);
        $listData->setOrdering($resultData['pageData']['ordering'] ?? []);
        $listData->setOffsets($resultData['pageData']['offsets'] ?? []);

        return $listData;
    }
}
