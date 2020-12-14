<?php

namespace App\Legacy\Data;

use App\Service\LegacyFilterMapper;
use BeanFactory;
use InvalidArgumentException;
use ListViewDataPort;
use SearchForm;
use SugarBean;
use ViewList;

class ListDataHandler implements ListDataHandlerInterface
{
    /**
     * @var LegacyFilterMapper
     */
    private $legacyFilterMapper;

    /**
     * @var RecordMapper
     */
    private $recordMapper;

    /**
     * ListDataHandler constructor.
     * @param LegacyFilterMapper $legacyFilterMapper
     * @param RecordMapper $recordMapper
     */
    public function __construct(
        LegacyFilterMapper $legacyFilterMapper,
        RecordMapper $recordMapper
    ) {
        $this->legacyFilterMapper = $legacyFilterMapper;
        $this->recordMapper = $recordMapper;
    }

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

        $mapped = $this->legacyFilterMapper->mapFilters($criteria, $type);

        $bean = $this->getBean($module);

        $baseCriteria = [
            'searchFormTab' => "${type}_search",
            'query' => 'true',
            'orderBy' => $this->legacyFilterMapper->getOrderBy($sort),
            'sortOrder' => $this->legacyFilterMapper->getSortOrder($sort)
        ];

        $legacyCriteria = array_merge($baseCriteria, $mapped);

        return $this->find($type, $bean, $offset, $limit, $legacyCriteria);
    }

    /**
     * @param string $module
     *
     * @return SugarBean
     * @throws InvalidArgumentException When the module is invalid.
     */
    private function getBean(string $module): SugarBean
    {
        $bean = BeanFactory::newBean($module);

        if (!$bean instanceof SugarBean) {
            throw new InvalidArgumentException(sprintf('Module %s does not exist', $module));
        }

        return $bean;
    }

    /**
     * @param string $type
     * @param SugarBean $bean
     * @param int $offset
     * @param int $limit
     * @param array $criteria
     * @return ListData
     */
    protected function find(string $type, SugarBean $bean, int $offset, int $limit, array $criteria = []): ListData
    {

        $legacyListView = $this->getLegacyListView($bean);
        $listViewDefs = $this->getListViewDefs($legacyListView);
        $searchForm = $this->getSearchForm($type, $bean, $listViewDefs, $criteria);
        $params = $this->getSortingParams($criteria);

        $where = $this->buildFilterClause($bean, $searchForm);

        $filter_fields = $legacyListView->lv->setupFilterFields([]);

        /* @noinspection PhpIncludeInspection */
        require_once 'include/portability/ListView/ListViewDataPort.php';
        $resultData = (new ListViewDataPort())->get($bean, $where, $offset, $limit, $filter_fields, $params);

        $listData = new ListData();
        $records = $this->recordMapper->mapRecords($resultData['data'] ?? []);
        $listData->setRecords($records);
        $listData->setOrdering($resultData['pageData']['ordering'] ?? []);
        $listData->setOffsets($resultData['pageData']['offsets'] ?? []);

        return $listData;
    }

    /**
     * @param SugarBean $bean
     * @return ViewList
     */
    protected function getLegacyListView(SugarBean $bean): ViewList
    {
        $legacyListView = new ViewList();
        $legacyListView->bean = $bean;
        $legacyListView->module = $bean->module_name;
        $legacyListView->preDisplay();

        return $legacyListView;
    }

    /**
     * Get list view defs
     * @param ViewList $legacyListView
     * @return array
     */
    protected function getListViewDefs(ViewList $legacyListView): array
    {
        $listViewDefs = [];
        $metadataFile = $legacyListView->getMetaDataFile();

        /* @noinspection PhpIncludeInspection */
        require $metadataFile;

        return $listViewDefs;
    }

    /**
     * @param string $type
     * @param SugarBean $bean
     * @param array $listViewDefs
     * @param array $criteria
     * @return SearchForm
     */
    protected function getSearchForm(
        string $type,
        SugarBean $bean,
        array $listViewDefs,
        array $criteria = []
    ): SearchForm {

        /* @noinspection PhpIncludeInspection */
        require_once 'include/SearchForm/SearchForm2.php';
        $searchMetaData = SearchForm::retrieveSearchDefs($bean->module_name);
        $searchForm = new SearchForm($bean, $bean->module_name, 'index');
        $searchForm->setup(
            $searchMetaData['searchdefs'],
            $searchMetaData['searchFields'],
            'SearchFormGeneric.tpl',
            $type . '_search',
            $listViewDefs
        );

        $searchForm->populateFromArray($criteria);

        return $searchForm;
    }

    /**
     * Get Legacy sorting parameters
     * @param array $criteria
     * @return array
     */
    protected function getSortingParams(array $criteria): array
    {
        $params = [];
        if (!empty($criteria['orderBy'])) {
            $params = [
                'orderBy' => strtoupper($criteria['orderBy']),
                'sortOrder' => $criteria['sortOrder'] ?? '',
                'skipOrderSave' => true,
                'overrideOrder' => true,
                'custom_order' => true
            ];
        }

        return $params;
    }

    /**
     * @param SugarBean $bean
     * @param SearchForm $searchForm
     * @return string
     */
    protected function buildFilterClause(SugarBean $bean, SearchForm $searchForm): string
    {
        $where_clauses = $searchForm->generateSearchWhere(true, $bean->module_dir);

        $where = '';
        if (count($where_clauses) > 0) {
            $where = '(' . implode(' ) AND ( ', $where_clauses) . ')';
        }

        return $where;
    }
}
