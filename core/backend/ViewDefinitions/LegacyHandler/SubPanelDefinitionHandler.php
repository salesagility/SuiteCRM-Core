<?php

namespace App\ViewDefinitions\LegacyHandler;

use App\Engine\LegacyHandler\LegacyHandler;
use App\Engine\LegacyHandler\LegacyScopeState;
use App\FieldDefinitions\Service\FieldDefinitionsProviderInterface;
use App\Module\Service\ModuleNameMapperInterface;
use App\ViewDefinitions\Service\SubPanelDefinitionProviderInterface;
use aSubPanel;
use SubPanelDefinitions;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

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
     * @param SessionInterface $session
     */
    public function __construct(
        string $projectDir,
        string $legacyDir,
        string $legacySessionName,
        string $defaultSessionName,
        LegacyScopeState $legacyScopeState,
        ModuleNameMapperInterface $moduleNameMapper,
        FieldDefinitionsProviderInterface $fieldDefinitionProvider,
        SessionInterface $session
    ) {
        parent::__construct($projectDir, $legacyDir, $legacySessionName, $defaultSessionName, $legacyScopeState, $session);
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

            $tabs[$key]['insightWidget'] = $this->mapInsightWidget($subpanel, $tabs, $key, $tab);

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
            return $this->moduleNameMapper->toFrontEnd($vardefModule);
        }

        $headerModule = $tab['header_definition_from_subpanel'];
        $vardefModule = $tab['collection_list'][$headerModule]['module'] ?? '';

        if ($vardefModule) {
            return $this->moduleNameMapper->toFrontEnd($vardefModule);
        }

        $vardefModule = reset($tab['collection_list'])['module'] ?? '';
        if ($vardefModule) {
            return $this->moduleNameMapper->toFrontEnd($vardefModule);
        }

        $vardefModule = $tab['module'];

        return $this->moduleNameMapper->toFrontEnd($vardefModule);
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
        $topButtonDefinitions = $this->getButtonDefinitions($subpanel);

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
                $mappedButton['additionalFields'] = $top_button['additionalFields'] ?? [];
                $mappedButton['extraParams'] = $top_button['extraParams'] ?? [];
                $mappedButton['widget_class'] = $top_button['widget_class'] ?? [];
                $topButtons[] = $mappedButton;
                continue;
            }

            if (strpos($top_button['widget_class'], 'Create') !== false) {
                $topButtons[] = [
                    'key' => 'create',
                    'labelKey' => 'LBL_QUICK_CREATE',
                    'widget_class' => $top_button['widget_class'],
                    'module' => $this->moduleNameMapper->toFrontEnd($tab['module']),
                    'additionalFields' => $top_button['additionalFields'] ?? [],
                    'extraParams' => $top_button['extraParams'] ?? []
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
    protected function getButtonDefinitions(aSubPanel $subpanel): array
    {
        return $subpanel->get_buttons() ?? [];
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

        return $this->addFieldDefinition($vardefs, strtolower($key), $column, $this->defaultDefinition);
    }

    /**
     * @param $subpanel
     * @param array $tabs
     * @param $key
     * @param $tab
     * @return array
     */
    protected function mapInsightWidget($subpanel, array $tabs, $key, $tab): array
    {
        if (!empty($subpanel->panel_definition['insightWidget'])) {
            $widgetConfig = [
                'type' => 'statistics',
                'options' => [
                    'insightWidget' => $subpanel->panel_definition['insightWidget']
                ]
            ];

            $this->replaceVariables($tabs, $key, $widgetConfig, $widgetRows);

            return $widgetConfig;
        }

        if (empty($tabs[$key]['insightWidget'])) {
            return $this->getDefaultWidgetConfig($tabs, $key, $tab);
        }

        return [];
    }

    /**
     * @param array $tabs
     * @param $key
     * @param $tab
     * @return array
     */
    protected function getDefaultWidgetConfig(array $tabs, $key, $tab): array
    {
        return [
            'type' => 'statistics',
            'options' => [
                'insightWidget' => [
                    'rows' => [
                        [
                            'justify' => 'end',
                            'cols' => [
                                [
                                    'icon' => $tab['module'],
                                ],
                            ]
                        ],
                        [
                            'align' => 'end',
                            'justify' => 'start',
                            'class' => 'flex-grow-1',
                            'cols' => [
                                [
                                    'statistic' => $tabs[$key]['module'],
                                    'class' => 'sub-panel-banner-value',
                                    'bold' => true,
                                ],
                            ]
                        ],
                        [
                            'justify' => 'start',
                            'cols' => [
                                [
                                    'descriptionKey' => $tabs[$key]['title_key'] . '_INSIGHT_DESCRIPTION',
                                    'class' => 'sub-panel-banner-tooltip',
                                ]
                            ]
                        ],
                        [
                            'justify' => 'start',
                            'cols' => [
                                [
                                    'labelKey' => $tabs[$key]['title_key'],
                                    'class' => 'sub-panel-banner-button-title',
                                    'bold' => true,
                                ]
                            ]
                        ],
                    ]
                ]
            ]
        ];
    }

    /**
     * @param string $titleKey
     * @param $col
     * @param array $widgetRows
     * @param $rowKey
     * @param $colKey
     */
    protected function replaceLabelKey(string $titleKey, $col, array &$widgetRows, $rowKey, $colKey): void
    {
        $labelKey = $col['labelKey'] ?? '';
        if ($labelKey !== '') {
            $labelKey = str_replace('{{title_key}}', $titleKey, $labelKey);
            $widgetRows[$rowKey]['cols'][$colKey]['labelKey'] = $labelKey;
        }
    }

    /**
     * @param array $tabs
     * @param $key
     * @param array $widgetConfig
     * @param $widgetRows
     */
    protected function replaceVariables(array $tabs, $key, array &$widgetConfig, &$widgetRows): void
    {
        $widgetRows = $widgetConfig['options']['insightWidget']['rows'] ?? [];

        foreach ($widgetRows as $rowKey => $row) {
            $cols = $row['cols'] ?? [];
            foreach ($cols as $colKey => $col) {
                $this->replaceLabelKey($tabs[$key]['title_key'], $col, $widgetRows, $rowKey, $colKey);
            }
        }

        if (isset($widgetConfig['options']['insightWidget']['rows'])) {
            $widgetConfig['options']['insightWidget']['rows'] = $widgetRows;
        }
    }
}
