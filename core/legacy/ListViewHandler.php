<?php

namespace SuiteCRM\Core\Legacy;

use App\Entity\ListView;
use App\Service\ListViewProviderInterface;
use App\Service\ModuleNameMapperInterface;
use BeanFactory;
use InvalidArgumentException;
use ListViewData;
use SearchForm;
use SugarBean;
use ViewList;

/**
 * Class ListViewHandler
 * @package SuiteCRM\Core\Legacy
 */
class ListViewHandler extends LegacyHandler implements ListViewProviderInterface
{
    public const HANDLER_KEY = 'list-view';

    /**
     * @var ModuleNameMapperInterface
     */
    private $moduleNameMapper;
    /**
     * @var array
     */
    private $filterOperatorMap;

    /**
     * SystemConfigHandler constructor.
     * @param string $projectDir
     * @param string $legacyDir
     * @param string $legacySessionName
     * @param string $defaultSessionName
     * @param LegacyScopeState $legacyScopeState
     * @param ModuleNameMapperInterface $moduleNameMapper
     * @param array $filterOperatorMap
     */
    public function __construct(
        string $projectDir,
        string $legacyDir,
        string $legacySessionName,
        string $defaultSessionName,
        LegacyScopeState $legacyScopeState,
        ModuleNameMapperInterface $moduleNameMapper,
        array $filterOperatorMap
    ) {
        parent::__construct($projectDir, $legacyDir, $legacySessionName, $defaultSessionName, $legacyScopeState);
        $this->moduleNameMapper = $moduleNameMapper;
        $this->filterOperatorMap = $filterOperatorMap;
    }

    /**
     * @inheritDoc
     */
    public function getHandlerKey(): string
    {
        return self::HANDLER_KEY;
    }

    /**
     * @param string $moduleName
     * @param array $criteria
     * @param int $offset
     * @param int $limit
     * @return ListView
     */
    public function getListView(string $moduleName, array $criteria = [], int $offset = -1, int $limit = -1): ListView
    {
        $this->init();

        $listView = new ListView();
        $moduleName = $this->validateModuleName($moduleName);
        $bean = $this->newBeanSafe($moduleName);
        $listViewData = $this->getData($bean, $criteria, $offset, $limit);
        $listView->setId($moduleName);
        $listView->setMeta($this->getMeta($listViewData['pageData']));
        $listView->setRecords($this->getRecords($bean, $listViewData));

        $this->close();

        return $listView;
    }

    /**
     * @param array $pageData
     * @return array
     */
    protected function getMeta(array $pageData): array
    {
        return [
            'offsets' => $pageData['offsets'],
            'ordering' => $pageData['ordering'],
        ];
    }

    /**
     * @param SugarBean $bean
     * @param array $fullViewData
     * @return array
     */
    protected function getRecords(SugarBean $bean, array $fullViewData): array
    {

        $processedData = [];
        foreach ($fullViewData['data'] as $key => $record) {
            $array = array_change_key_case($record);
            $id = $array['id'];
            unset($array['id']);

            $array = [
                'type' => $bean->object_name,
                'id' => $id,
                'attributes' => $array,
                'relationships' => []
            ];

            $processedData[$key] = $array;
        }

        return $processedData;
    }

    /**
     * @param string $module
     *
     * @return SugarBean
     * @throws InvalidArgumentException When the module is invalid.
     */
    private function newBeanSafe($module): SugarBean
    {
        $bean = BeanFactory::newBean($module);

        if (!$bean instanceof SugarBean) {
            throw new InvalidArgumentException(sprintf('Module %s does not exist', $module));
        }

        return $bean;
    }

    /**
     * @param $moduleName
     * @return string
     */
    private function validateModuleName($moduleName): string
    {
        $moduleName = $this->moduleNameMapper->toLegacy($moduleName);

        if (!$this->moduleNameMapper->isValidModule($moduleName)) {
            throw new InvalidArgumentException('Invalid module name: ' . $moduleName);
        }

        return $moduleName;
    }

    /**
     * @param SugarBean $bean
     * @param array $criteria
     * @param int $offset
     * @param int $limit
     * @return array
     */
    protected function getData(SugarBean $bean, array $criteria = [], int $offset = -1, int $limit = -1): array
    {
        $type = $criteria['type'] ?? 'advanced';

        $mapped = $this->mapFilters($criteria, $type);

        $baseCriteria = [
            'searchFormTab' => "${type}_search",
            'query' => 'true',
            'orderBy' => $criteria['orderBy'] ?? '',
            'sortOrder' => $criteria['sortOrder'] ?? ''
        ];

        $legacyCriteria = array_merge($baseCriteria, $mapped);

        return $this->find($bean, $offset, $limit, $legacyCriteria);
    }

    /**
     * @param SugarBean $bean
     * @param int $offset
     * @param int $limit
     * @param array $criteria
     * @param array $filterFields
     * @return array
     */
    protected function find(
        SugarBean $bean,
        int $offset,
        int $limit,
        array $criteria = [],
        array $filterFields = []
    ): array {
        $legacyListView = $this->getLegacyListView($bean);
        $listViewDefs = $this->getListViewDefs($legacyListView);
        $searchForm = $this->getSearchForm($bean, $listViewDefs, $criteria);

        $where = $this->buildFilterClause($bean, $searchForm);

        $filter_fields = $legacyListView->lv->setupFilterFields($filterFields);


        $params = $this->getSortingParams($criteria);

        /* @noinspection PhpIncludeInspection */
        require_once 'include/ListView/ListViewData.php';
        $listViewData = new ListViewData();

        return $listViewData->getListViewData($bean, $where, $offset, $limit, $filter_fields, $params);
    }

    /**
     * Map Filters to legacy
     * @param array $criteria
     * @param string $type
     * @return array
     */
    protected function mapFilters(array $criteria, string $type): array
    {
        $mapped = [];

        if (empty($criteria['filters'])) {
            return $mapped;
        }

        foreach ($criteria['filters'] as $key => $item) {
            if (empty($item['operator'])) {
                continue;
            }

            if (empty($this->filterOperatorMap[$item['operator']])) {
                continue;
            }

            $mapConfig = $this->filterOperatorMap[$item['operator']];

            foreach ($mapConfig as $mappedKey => $mappedValue) {
                $legacyKey = $this->mapFilterKey($type, $key, $mappedKey);
                $legacyValue = $this->mapFilterValue($mappedValue, $item);

                $mapped[$legacyKey] = $legacyValue;
            }


        }

        return $mapped;
    }

    /**
     * Map Filter key to legacy
     * @param string $type
     * @param string $key
     * @param string $mappedKey
     * @return string|string[]
     */
    protected function mapFilterKey(string $type, string $key, string $mappedKey): string
    {
        return str_replace(array('{field}', '{type}'), array($key, $type), $mappedKey);
    }

    /**
     * Map Filter value to legacy
     * @param string $mappedValue
     * @param array $item
     * @return mixed|string|string[]
     */
    protected function mapFilterValue(string $mappedValue, array $item)
    {
        if ($mappedValue === 'values') {

            if (count($item['values']) === 1) {
                $legacyValue = $item['values'][0];
            } else {
                $legacyValue = $item['values'];
            }

            return $legacyValue;
        }

        $operator = $item['operator'] ?? '';
        $start = $item['start'] ?? '';
        $end = $item['end'] ?? '';

        return str_replace(['{operator}', '{start}', '{end}'], [$operator, $start, $end], $mappedValue);
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

        require $metadataFile;

        return $listViewDefs;
    }

    /**
     * @param SugarBean $bean
     * @param array $listViewDefs
     * @param array $criteria
     * @return SearchForm
     */
    protected function getSearchForm(SugarBean $bean, array $listViewDefs, array $criteria = []): SearchForm
    {
        /* @noinspection PhpIncludeInspection */
        require_once 'include/SearchForm/SearchForm2.php';
        $searchMetaData = SearchForm::retrieveSearchDefs($bean->module_name);
        $searchForm = new SearchForm($bean, $bean->module_name, 'index');
        $searchForm->setup($searchMetaData['searchdefs'], $searchMetaData['searchFields'], 'SearchFormGeneric.tpl',
            'advanced_search', $listViewDefs);

        $searchForm->populateFromArray($criteria);

        return $searchForm;
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
                'overrideOrder' => true
            ];
        }

        return $params;
    }
}
