<?php

namespace SuiteCRM\Core\Legacy;

use App\Entity\FieldDefinition;
use App\Entity\ViewDefinition;
use App\Service\BulkActionDefinitionProviderInterface;
use App\Service\ChartDefinitionProviderInterface;
use App\Service\FieldDefinitionsProviderInterface;
use App\Service\FilterDefinitionProviderInterface;
use App\Service\LineActionDefinitionProviderInterface;
use App\Service\ModuleNameMapperInterface;
use App\Service\SubPanelDefinitionProviderInterface;
use App\Service\ViewDefinitionsProviderInterface;
use Exception;
use InvalidArgumentException;
use ListViewFacade;
use Psr\Log\LoggerInterface;
use SearchForm;
use SuiteCRM\Core\Legacy\ViewDefinitions\RecordViewDefinitionHandler;
use SuiteCRM\Core\Legacy\ViewDefinitions\SubPanelDefinitionHandler;
use function in_array;

/**
 * Class ViewDefinitionsHandler
 */
class ViewDefinitionsHandler extends LegacyHandler implements ViewDefinitionsProviderInterface
{
    public const HANDLER_KEY = 'view-definitions';


    /**
     * @var array
     */
    protected $listViewColumnInterface = [
        'name' => '',
        'width' => '',
        'label' => '',
        'link' => false,
        'default' => false,
        'module' => '',
        'id' => '',
        'sortable' => true,
        'type' => ''
    ];

    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @var FieldDefinitionsProviderInterface
     */
    private $fieldDefinitionProvider;

    /**
     * @var BulkActionDefinitionProviderInterface
     */
    private $bulkActionDefinitionProvider;

    /**
     * @var LineActionDefinitionProviderInterface
     */
    private $lineActionDefinitionProvider;

    /**
     * @var ChartDefinitionProviderInterface
     */
    private $chartDefinitionProvider;

    /**
     * @var FilterDefinitionProviderInterface
     */
    private $filterDefinitionProvider;

    /**
     * @var array
     */
    private $defaultFields = [
        'type' => 'type',
        'label' => 'vname',
    ];

    /**
     * @var ModuleNameMapperInterface
     */
    private $moduleNameMapper;

    /**
     * @var RecordViewDefinitionHandler
     */
    private $recordViewDefinitionHandler;

    /**
     * @var SubPanelDefinitionHandler
     */
    private $subPanelDefinitionHandler;

    /**
     * ViewDefinitionsHandler constructor.
     * @param string $projectDir
     * @param string $legacyDir
     * @param string $legacySessionName
     * @param string $defaultSessionName
     * @param LegacyScopeState $legacyScopeState
     * @param ModuleNameMapperInterface $moduleNameMapper
     * @param FieldDefinitionsProviderInterface $fieldDefinitionProvider
     * @param BulkActionDefinitionProviderInterface $bulkActionDefinitionProvider
     * @param ChartDefinitionProviderInterface $chartDefinitionProvider
     * @param LineActionDefinitionProviderInterface $lineActionDefinitionProvider
     * @param FilterDefinitionProviderInterface $filterDefinitionProvider
     * @param RecordViewDefinitionHandler $recordViewDefinitionHandler
     * @param LoggerInterface $logger
     * @param SubPanelDefinitionProviderInterface $subPanelDefinitionHandler
     */
    public function __construct(
        string $projectDir,
        string $legacyDir,
        string $legacySessionName,
        string $defaultSessionName,
        LegacyScopeState $legacyScopeState,
        ModuleNameMapperInterface $moduleNameMapper,
        FieldDefinitionsProviderInterface $fieldDefinitionProvider,
        BulkActionDefinitionProviderInterface $bulkActionDefinitionProvider,
        ChartDefinitionProviderInterface $chartDefinitionProvider,
        LineActionDefinitionProviderInterface $lineActionDefinitionProvider,
        FilterDefinitionProviderInterface $filterDefinitionProvider,
        RecordViewDefinitionHandler $recordViewDefinitionHandler,
        LoggerInterface $logger,
        SubPanelDefinitionProviderInterface $subPanelDefinitionHandler
    ) {
        parent::__construct($projectDir, $legacyDir, $legacySessionName, $defaultSessionName, $legacyScopeState);
        $this->moduleNameMapper = $moduleNameMapper;
        $this->fieldDefinitionProvider = $fieldDefinitionProvider;
        $this->bulkActionDefinitionProvider = $bulkActionDefinitionProvider;
        $this->chartDefinitionProvider = $chartDefinitionProvider;
        $this->lineActionDefinitionProvider = $lineActionDefinitionProvider;
        $this->recordViewDefinitionHandler = $recordViewDefinitionHandler;
        $this->subPanelDefinitionHandler = $subPanelDefinitionHandler;
        $this->filterDefinitionProvider = $filterDefinitionProvider;
        $this->logger = $logger;
    }

    /**
     * @inheritDoc
     */
    public function getHandlerKey(): string
    {
        return self::HANDLER_KEY;
    }

    /**
     * @inheritDoc
     */
    public function getViewDefs(string $moduleName, array $views = []): ViewDefinition
    {
        $this->init();

        if (empty($views)) {
            $views = [
                'detailView',
                'editView',
                'listView',
                'search',
                'subPanel'
            ];
        }

        $fieldDefinition = $this->fieldDefinitionProvider->getVardef($moduleName);

        $legacyModuleName = $this->validateModuleName($moduleName);

        $viewDef = new ViewDefinition();
        $viewDef->setId($moduleName);


        if (in_array('listView', $views, true)) {
            $listViewDef = $this->fetchListViewDef($moduleName, $legacyModuleName, $fieldDefinition);
            $viewDef->setListView($listViewDef);
        }

        if (in_array('search', $views, true)) {
            $viewDef->setSearch($this->fetchSearchDefs($legacyModuleName, $fieldDefinition));
        }

        if (in_array('recordView', $views, true)) {
            $recordViewDefs = $this->recordViewDefinitionHandler->fetch($legacyModuleName, $fieldDefinition);
            $viewDef->setRecordView($recordViewDefs);
        }

        if (in_array('subPanel', $views, true)) {
            $subPanelViewDefs = $this->subPanelDefinitionHandler->getSubPanelDef($legacyModuleName);
            $viewDef->setSubPanel($subPanelViewDefs);
        }

        $this->close();

        return $viewDef;
    }

    /**
     * @inheritDoc
     */
    public function getListViewDef(string $moduleName): ViewDefinition
    {
        $this->init();

        $fieldDefinition = $this->fieldDefinitionProvider->getVardef($moduleName);
        $legacyModuleName = $this->validateModuleName($moduleName);

        $viewDef = new ViewDefinition();
        $viewDef->setId($moduleName);
        $viewDef->setListView($this->fetchListViewDef($moduleName, $legacyModuleName, $fieldDefinition));

        $this->close();

        return $viewDef;
    }

    /**
     * @inheritDoc
     */
    public function getSearchDefs(string $moduleName): ViewDefinition
    {
        $this->init();

        $fieldDefinition = $this->fieldDefinitionProvider->getVardef($moduleName);

        $legacyModuleName = $this->validateModuleName($moduleName);

        $viewDef = new ViewDefinition();
        $viewDef->setId($moduleName);
        $viewDef->setSearch($this->fetchSearchDefs($legacyModuleName, $fieldDefinition));

        $this->close();

        return $viewDef;
    }

    /**
     * @inheritDoc
     */
    public function getRecordViewDefs(string $moduleName): ViewDefinition
    {
        $this->init();

        $fieldDefinition = $this->fieldDefinitionProvider->getVardef($moduleName);

        $legacyModuleName = $this->validateModuleName($moduleName);

        $viewDef = new ViewDefinition();
        $viewDef->setId($moduleName);
        $recordViewDefs = $this->recordViewDefinitionHandler->fetch($legacyModuleName, $fieldDefinition);
        $viewDef->setRecordView($recordViewDefs);

        $this->close();

        return $viewDef;
    }

    /**
     * Internal API
     */

    /**
     * Get list view defs array
     * @param string $module
     * @param string $legacyModuleName
     * @param FieldDefinition $fieldDefinition
     * @return array
     * @throws Exception
     */
    protected function fetchListViewDef(
        string $module,
        string $legacyModuleName,
        FieldDefinition $fieldDefinition
    ): array {
        $metadata = [
            'columns' => [],
            'bulkActions' => [],
            'lineActions' => [],
            'availableCharts' => [],
            'availableFilters' => [],
        ];

        /* @noinspection PhpIncludeInspection */
        include_once 'include/ListView/ListViewFacade.php';

        $vardefs = $fieldDefinition->getVardef();

        $displayColumns = ListViewFacade::getDisplayColumns($legacyModuleName);
        $data = [];
        foreach ($displayColumns as $key => $column) {

            if (!isset($vardefs[strtolower($key)])) {
                $this->logger->warning("ListViewDefinitions: '$key' not set on vardefs. Ignoring.");
                continue;
            }

            $data[] = $this->buildListViewColumn($column, $key, $vardefs);
        }

        $metadata['columns'] = $data;
        $metadata['bulkActions'] = $this->bulkActionDefinitionProvider->getBulkActions($module);
        $metadata['lineActions'] = $this->lineActionDefinitionProvider->getLineActions($module);
        $metadata['availableCharts'] = $this->chartDefinitionProvider->getCharts($module);
        $metadata['availableFilters'] = $this->filterDefinitionProvider->getFilters($module);

        return $metadata;
    }

    /**
     * Build list view column
     * @param $column
     * @param $key
     * @param array|null $vardefs
     * @return array
     */
    protected function buildListViewColumn($column, $key, ?array $vardefs): array
    {
        $column = array_merge($this->listViewColumnInterface, $column);
        $column['name'] = strtolower($key);

        $column = $this->addFieldDefinition($vardefs, strtolower($key), $column);

        if ($column['name'] === 'email1') {
            $column['type'] = 'email';
            $column['link'] = false;
        }

        return $column;
    }

    /**
     * Get search defs array
     * @param string $module
     * @param FieldDefinition $fieldDefinition
     * @return array
     */
    protected function fetchSearchDefs(string $module, FieldDefinition $fieldDefinition): array
    {
        /* @noinspection PhpIncludeInspection */
        require_once 'include/SearchForm/SearchForm2.php';

        $searchDefs = SearchForm::retrieveSearchDefs($module);

        $definition = [];

        if (empty($searchDefs) || !isset($searchDefs['searchdefs'][$module])) {
            return $definition;
        }

        $definition = $searchDefs['searchdefs'][$module];

        if (isset($definition['templateMeta'])) {
            unset($definition['templateMeta']);
        }

        $this->mergeSearchInfo($module, $definition, $searchDefs, 'basic_search');
        $this->mergeSearchInfo($module, $definition, $searchDefs, 'advanced_search');

        $this->mergeFieldDefinition($definition, $fieldDefinition, 'basic_search');
        $this->mergeFieldDefinition($definition, $fieldDefinition, 'advanced_search');

        $this->renameSearchLayout($definition, 'basic_search', 'basic');
        $this->renameSearchLayout($definition, 'advanced_search', 'advanced');

        return $definition;
    }

    /**
     * Merge searchFields defs info into vardefs
     * @param array $definition
     * @param FieldDefinition $fieldDefinition
     * @param string $type
     */
    protected function mergeFieldDefinition(array &$definition, FieldDefinition $fieldDefinition, string $type): void
    {
        $vardefs = $fieldDefinition->getVardef();
        if (isset($definition['layout'][$type])) {

            foreach ($definition['layout'][$type] as $key => $field) {
                $fieldName = $this->getFieldName($key, $field);

                if (!empty($vardefs[$fieldName])) {
                    $merged = $this->addFieldDefinition($vardefs, $fieldName, $field);
                    $definition['layout'][$type][$key] = $merged;
                }
            }
        }
    }

    /**
     * Add field definition to current field metadata
     * @param array|null $vardefs
     * @param $key
     * @param $field
     * @return array
     */
    protected function addFieldDefinition(array $vardefs, $key, $field): array
    {
        $baseField = $this->getField($field);

        $field = array_merge($this->listViewColumnInterface, $baseField);

        if (!isset($vardefs[$key])) {
            return $field;
        }

        $field['fieldDefinition'] = $vardefs[$key];

        $field = $this->applyDefaults($field);

        return $field;
    }

    /**
     * Merge searchFields defs info into searchDefs
     * @param string $module
     * @param array $definition
     * @param array $searchDefs
     * @param string $type
     */
    protected function mergeSearchInfo(string $module, array &$definition, array $searchDefs, string $type): void
    {
        if (isset($definition['layout'][$type])) {
            foreach ($definition['layout'][$type] as $key => $field) {
                $name = $field['name'] ?? '';

                if ($this->useRangeSearch($module, $searchDefs, $name)) {
                    $definition['layout'][$type][$key]['enable_range_search'] = true;
                }
            }
        }
    }

    /**
     * If to use range search
     *
     * @param string $module
     * @param array $searchDefs
     * @param $fieldName
     * @return bool
     */
    protected function useRangeSearch(string $module, array $searchDefs, $fieldName): bool
    {
        if (isset($searchDefs['searchFields'][$module]["range_$fieldName"])) {
            return true;
        }

        return false;
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
     * Rename layout entry
     * @param array $definition
     * @param string $type
     * @param string $newName
     */
    protected function renameSearchLayout(array &$definition, string $type, string $newName): void
    {
        if (isset($definition['layout'][$type])) {
            $definition['layout'][$newName] = $definition['layout'][$type];
            unset($definition['layout'][$type]);
        }
    }

    /**
     * Extract field name
     * @param $key
     * @param $field
     * @return string
     */
    protected function getFieldName($key, $field): string
    {
        if (is_numeric($key) && is_string($field)) {
            return $field;
        }

        if (is_numeric($key)) {
            return $field['name'];
        }

        return $key;
    }

    /**
     * Get base field structure
     * @param $field
     * @return array
     */
    protected function getField($field): array
    {
        $baseField = $field;

        if (is_string($field)) {
            $baseField = [
                'name' => $field,
            ];
        }

        return $baseField;
    }

    /**
     * Apply defaults
     * @param array $field
     * @return array
     */
    protected function applyDefaults(array $field): array
    {
        foreach ($this->defaultFields as $attribute => $default) {
            if (empty($field[$attribute])) {
                $defaultValue = $field['fieldDefinition'][$default] ?? '';
                $field[$attribute] = $defaultValue;
            }
        }

        return $field;
    }
}
