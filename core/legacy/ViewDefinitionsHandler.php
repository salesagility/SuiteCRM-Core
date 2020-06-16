<?php

namespace SuiteCRM\Core\Legacy;

use App\Entity\FieldDefinition;
use App\Entity\ViewDefinition;
use App\Service\FieldDefinitionsProviderInterface;
use App\Service\ModuleNameMapperInterface;
use App\Service\ViewDefinitionsProviderInterface;
use Exception;
use InvalidArgumentException;
use ListViewFacade;
use SearchForm;

/**
 * Class ViewDefinitions
 */
class ViewDefinitionsHandler extends LegacyHandler implements ViewDefinitionsProviderInterface
{
    public const HANDLER_KEY = 'view-definitions';

    /**
     * @var array
     */
    protected static $listViewColumnInterface = [
        'fieldName' => '',
        'width' => '',
        'label' => '',
        'link' => false,
        'default' => false,
        'module' => '',
        'id' => '',
        'sortable' => false
    ];

    /**
     * @var array
     */
    protected static $vardefAttributes = [
        'name' => '',
        'vname' => '',
        'type' => '',
        'options' => '',
    ];

    /**
     * @var FieldDefinitionsProviderInterface
     */
    private $fieldDefinitionProvider;

    /**
     * @inheritDoc
     */
    public function getHandlerKey(): string
    {
        return self::HANDLER_KEY;
    }

    /**
     * @var ModuleNameMapperInterface
     */
    protected $moduleNameMapper;


    /**
     * SystemConfigHandler constructor.
     * @param string $projectDir
     * @param string $legacyDir
     * @param string $legacySessionName
     * @param string $defaultSessionName
     * @param LegacyScopeState $legacyScopeState
     * @param ModuleNameMapperInterface $moduleNameMapper
     * @param FieldDefinitionsProviderInterface $fieldDefinitionProvider
     */
    public function __construct(
        string $projectDir,
        string $legacyDir,
        string $legacySessionName,
        string $defaultSessionName,
        LegacyScopeState $legacyScopeState,
        ModuleNameMapperInterface $moduleNameMapper,
        FieldDefinitionsProviderInterface $fieldDefinitionProvider
    ) {
        parent::__construct($projectDir, $legacyDir, $legacySessionName, $defaultSessionName, $legacyScopeState);
        $this->moduleNameMapper = $moduleNameMapper;
        $this->fieldDefinitionProvider = $fieldDefinitionProvider;
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
                'search'
            ];
        }

        $fieldDefinition = $this->fieldDefinitionProvider->getVardef($moduleName);

        $legacyModuleName = $this->validateModuleName($moduleName);

        $viewDef = new ViewDefinition();
        $viewDef->setId($moduleName);

        if (in_array('listView', $views, true)) {
            $viewDef->setListView($this->fetchListViewDef($legacyModuleName));
        }

        if (in_array('search', $views, true)) {
            $viewDef->setSearch($this->fetchSearchDefs($legacyModuleName, $fieldDefinition));
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

        $legacyModuleName = $this->validateModuleName($moduleName);

        $viewDef = new ViewDefinition();
        $viewDef->setId($moduleName);
        $viewDef->setListView($this->fetchListViewDef($legacyModuleName));

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
     * Internal API
     */

    /**
     * Get list view defs array
     * @param string $module
     * @return array
     * @throws Exception
     */
    protected function fetchListViewDef(string $module): array
    {
        /* @noinspection PhpIncludeInspection */
        include_once 'include/ListView/ListViewFacade.php';

        $displayColumns = ListViewFacade::getDisplayColumns($module);
        $data = [];
        foreach ($displayColumns as $key => $column) {
            $column = array_merge(self::$listViewColumnInterface, $column);
            $column['fieldName'] = strtolower($key);
            $data[] = $column;
        }

        return $data;
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

                if (!empty($vardefs[$key])) {
                    $plucked = array_intersect_key($vardefs[$key], self::$vardefAttributes);
                    $this->renameKey($plucked, 'vname', 'label');
                    $this->renameKey($plucked, 'type', 'fieldType');
                    $merged = array_merge($plucked, $field);
                    $definition['layout'][$type][$key] = $merged;
                }
            }
        }
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
                $name = $field['name'];

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
     * Rename array key
     * @param array $plucked
     * @param string $oldKey
     * @param string $newKey
     */
    protected function renameKey(array &$plucked, string $oldKey, string $newKey): void
    {
        if (!isset($plucked[$oldKey])) {
            return;
        }
        $plucked[$newKey] = $plucked[$oldKey] ?? null;
        unset($plucked[$oldKey]);
    }
}
