<?php

namespace SuiteCRM\Core\Legacy\ViewDefinitions;

use App\Service\FieldDefinitionsProviderInterface;
use App\Service\ModuleNameMapperInterface;
use App\Service\SubPanelDefinitionProviderInterface;
use aSubPanel;
use SubPanelDefinitions;
use SuiteCRM\Core\Legacy\LegacyHandler;
use SuiteCRM\Core\Legacy\LegacyScopeState;

/**
 * Class SubPanelDefinitionHandler
 */
class SubPanelDefinitionHandler extends LegacyHandler implements SubPanelDefinitionProviderInterface
{
    use FieldDefinitionsInjectorTrait;

    public const HANDLER_KEY = 'subpanel-definitions';

    protected $defaultDefinition = [
        'name' => '',
        'label' => '',
        'sortable' => true,
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
     * ViewDefinitionsHandler constructor.
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
    public function getSubPanelDef(string $moduleName): array
    {
        /* @noinspection PhpIncludeInspection */
        include 'include/SubPanel/SubPanel.php';

        return $this->getModuleSubpanels($moduleName);
    }

    /**
     * Get module subpanels
     * @param string $module
     * @return array
     */
    protected function getModuleSubpanels(string $module): array
    {
        /* @noinspection PhpIncludeInspection */
        require_once 'include/SubPanel/SubPanelDefinitions.php';

        global $beanList, $beanFiles;
        if (!isset($beanList[$module])) {
            return [];
        }

        $class = $beanList[$module];
        require_once $beanFiles[$class];
        $mod = new $class();
        $spd = new SubPanelDefinitions($mod);

        $tabs = $spd->layout_defs['subpanel_setup'];

        foreach ($tabs as $key => $tab) {

            $subpanel = $spd->load_subpanel($key);

            $headerModule = $this->getHeaderModule($tab);
            $vardefs = $this->getSubpanelModuleVardefs($headerModule);

            $tabs[$key]['icon'] = $tab['module'];
            $tabs[$key]['name'] = $key;
            $tabs[$key]['module'] = $this->moduleNameMapper->toFrontEnd($tab['module']);
            $tabs[$key]['headerModule'] = $headerModule;
            $tabs[$key]['top_buttons'] = $this->mapButtons($subpanel, $tab);

            $columnSubpanel = $subpanel;
            if (!empty($tab['header_definition_from_subpanel']) && !empty($tab['collection_list'])) {
                $columnSubpanel = $subpanel->sub_subpanels[$headerModule];
            }

            $tabs[$key]['columns'] = $this->mapColumns($columnSubpanel, $vardefs);
        }

        return $tabs;
    }

    /**
     * @param $subpanel
     * @param $tab
     * @return array
     */
    protected function mapButtons(aSubPanel $subpanel, $tab): array
    {
        $topButtonDefinitions = $this->getButtonDefinitions($subpanel, $tab);

        $topButtons = [];

        foreach ($topButtonDefinitions as $top_button) {
            if (strpos($top_button['widget_class'], 'Create') !== false) {
                $topButtons[] = [
                    'key' => 'create',
                    'labelKey' => 'LBL_QUICK_CREATE'
                ];
            }
        }

        return $topButtons;
    }

    /**
     * @param $subpanel
     * @param $tab
     * @return array
     */
    protected function getButtonDefinitions(aSubPanel $subpanel, $tab): array
    {
        $defaultTopButtons = $subpanel->panel_definition['top_buttons'] ?? [];

        $topButtonDefinitions = [];
        if (!empty($tab['top_buttons'])) {
            $topButtonDefinitions = $tab['top_buttons'];
        } elseif (!empty($defaultTopButtons)) {
            $topButtonDefinitions = $defaultTopButtons;
        }

        return $topButtonDefinitions;
    }

    /**
     * @param $subpanel
     * @param array $vardefs
     * @return array
     */
    protected function mapColumns(aSubPanel $subpanel, array $vardefs): array
    {
        $subpanel->panel_definition['list_fields'];
        $definitions = [];

        if (empty($subpanel->panel_definition['list_fields'])) {
            return [];
        }

        foreach ($subpanel->panel_definition['list_fields'] as $key => $column) {
            $usage = $column['usage'] ?? '';

            if ($usage === 'query_only') {
                continue;
            }

            $name = $column['name'] ?? $key;

            if (!isset($vardefs[$key]) && !isset($vardefs[$name])) {
                continue;
            }

            $definitions[] = $this->buildColumn($column, $key, $vardefs);
        }

        return $definitions;
    }

    /**
     * Build column
     * @param $column
     * @param $key
     * @param array|null $vardefs
     * @return array
     */
    protected function buildColumn($column, $key, ?array $vardefs): array
    {
        if (!empty($column)) {
            $column['label'] = $column['vname'] ?? '';
            $column['name'] = $column['name'] ?? $key;
        }

        $widgetClass = $column['widget_class'] ?? '';
        if ($widgetClass === 'SubPanelDetailViewLink') {
            $column['link'] = true;
        }

        $column = $this->addFieldDefinition($vardefs, strtolower($key), $column, $this->defaultDefinition);

        return $column;
    }

    /**
     * @param string $vardefModule
     * @return array
     */
    protected function getSubpanelModuleVardefs(string $vardefModule): array
    {
        return $this->fieldDefinitionProvider->getVardef($vardefModule)->getVardef();
    }

    /**
     * @param array $tab
     * @return mixed|string
     */
    protected function getHeaderModule(array $tab)
    {
        $vardefModule = $tab['module'];

        if (empty($tab['header_definition_from_subpanel']) || empty($tab['collection_list'])) {
            $vardefModule = $this->moduleNameMapper->toFrontEnd($vardefModule);

            return $vardefModule;
        }

        $headerModule = $tab['header_definition_from_subpanel'];
        $vardefModule = $tab['collection_list'][$headerModule]['module'] ?? '';

        if ($vardefModule) {
            $vardefModule = $this->moduleNameMapper->toFrontEnd($vardefModule);

            return $vardefModule;
        }

        $vardefModule = reset($tab['collection_list'])['module'] ?? '';
        if ($vardefModule) {
            $vardefModule = $this->moduleNameMapper->toFrontEnd($vardefModule);

            return $vardefModule;
        }

        $vardefModule = $tab['module'];
        $vardefModule = $this->moduleNameMapper->toFrontEnd($vardefModule);

        return $vardefModule;
    }
}
