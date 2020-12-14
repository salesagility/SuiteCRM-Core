<?php

namespace App\Legacy\ViewDefinitions;

use App\Legacy\LegacyHandler;
use App\Legacy\LegacyScopeState;
use App\Service\FieldDefinitionsProviderInterface;
use App\Service\ModuleNameMapperInterface;
use App\Service\SubPanelDefinitionProviderInterface;
use aSubPanel;
use SubPanelDefinitions;

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
     * @var ModuleNameMapperInterface
     */
    protected $moduleNameMapper;
    /**
     * @var FieldDefinitionsProviderInterface
     */
    private $fieldDefinitionProvider;

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
    public function getHandlerKey(): string
    {
        return self::HANDLER_KEY;
    }

    /**
     * @inheritDoc
     */
    public function getSubPanelDef(string $moduleName): array
    {
        /* @noinspection PhpIncludeInspection */
        require_once 'include/SubPanel/SubPanel.php';

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

        $tabs = $spd->layout_defs['subpanel_setup'] ?? [];

        $resultingTabs = [];

        foreach ($tabs as $key => $tab) {

            $subpanel = $spd->load_subpanel($key);

            if ($subpanel === false) {
                continue;
            }

            $columnSubpanel = $subpanel;
            if (!empty($tab['collection_list'])) {
                $columnSubpanel = $subpanel->get_header_panel_def();
                $headerModule = $this->moduleNameMapper->toFrontEnd($columnSubpanel->get_module_name());
            } else {
                $headerModule = $this->getHeaderModule($tab);
            }

            $vardefs = $this->getSubpanelModuleVardefs($headerModule);

            $tabs[$key]['icon'] = $tab['module'];
            $tabs[$key]['name'] = $key;
            $tabs[$key]['module'] = $this->moduleNameMapper->toFrontEnd($tab['module']);
            $tabs[$key]['legacyModule'] = $tab['module'];
            $tabs[$key]['headerModule'] = $headerModule;
            $tabs[$key]['top_buttons'] = $this->mapButtons($subpanel, $tab);

            if (empty($columnSubpanel)) {
                continue;
            }

            $resultingTabs[$key] = $tabs[$key];

            $resultingTabs[$key]['columns'] = $this->mapColumns($columnSubpanel, $vardefs);
        }

        return $resultingTabs;
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

    /**
     * @param string $vardefModule
     * @return array
     */
    protected function getSubpanelModuleVardefs(string $vardefModule): array
    {
        return $this->fieldDefinitionProvider->getVardef($vardefModule)->getVardef();
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

        $mapped = [
            'SubPanelTopCreateTaskButton' => [
                'key' => 'create',
                'labelKey' => 'LNK_NEW_TASK',
                'module' => 'tasks'
            ],
            'SubPanelTopScheduleMeetingButton' => [
                'key' => 'create',
                'labelKey' => 'LNK_NEW_MEETING',
                'module' => 'meetings'
            ],
            'SubPanelTopScheduleCallButton' => [
                'key' => 'create',
                'labelKey' => 'LNK_NEW_CALL',
                'module' => 'calls'
            ],
            'SubPanelTopComposeEmailButton' => [
                'skip' => true,
            ],
            'SubPanelTopCreateNoteButton' => [
                'key' => 'create',
                'labelKey' => 'LNK_NEW_NOTE',
                'module' => 'notes'
            ],
            'SubPanelTopArchiveEmailButton' => [
                'skip' => true,
            ],
            'SubPanelTopSummaryButton' => [
                'skip' => true,
            ],
            'SubPanelTopFilterButton' => [
                'skip' => true,
            ],
        ];

        foreach ($topButtonDefinitions as $top_button) {
            if (empty($top_button['widget_class'])) {
                continue;
            }

            $mappedButton = $mapped[$top_button['widget_class']] ?? null;

            if ($mappedButton !== null && !empty($mappedButton['skip'])) {
                continue;
            }

            if ($mappedButton !== null) {
                $topButtons[] = $mappedButton;
                continue;
            }

            if (strpos($top_button['widget_class'], 'Create') !== false) {
                $topButtons[] = [
                    'key' => 'create',
                    'labelKey' => 'LBL_QUICK_CREATE',
                    'module' => $this->moduleNameMapper->toFrontEnd($tab['module'])
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
        $panelDefinition = $subpanel->panel_definition ?? [];
        $listFields = $panelDefinition['list_fields'] ?? [];
        $definitions = [];

        if (empty($listFields)) {
            return [];
        }

        foreach ($listFields as $key => $column) {
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
}
