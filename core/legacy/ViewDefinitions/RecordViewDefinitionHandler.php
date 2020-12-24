<?php

namespace App\Legacy\ViewDefinitions;

use App\Entity\FieldDefinition;
use App\Legacy\LegacyHandler;
use App\Legacy\LegacyScopeState;
use App\Service\RecordActionDefinitionProviderInterface;
use BeanFactory;
use DetailView2;
use EditView;
use Psr\Log\LoggerInterface;
use ViewDetail;
use ViewEdit;
use ViewFactory;

class RecordViewDefinitionHandler extends LegacyHandler
{
    use FieldDefinitionsInjectorTrait;

    protected $defaultDefinition = [
        'name' => '',
        'label' => '',
    ];

    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @var RecordActionDefinitionProviderInterface
     */
    private $actionDefinitionProvider;

    /**
     * RecordViewDefinitionHandler constructor.
     * @param string $projectDir
     * @param string $legacyDir
     * @param string $legacySessionName
     * @param string $defaultSessionName
     * @param LegacyScopeState $legacyScopeState
     * @param LoggerInterface $logger
     * @param RecordActionDefinitionProviderInterface $actionDefinitionProvider
     */
    public function __construct(
        string $projectDir,
        string $legacyDir,
        string $legacySessionName,
        string $defaultSessionName,
        LegacyScopeState $legacyScopeState,
        LoggerInterface $logger,
        RecordActionDefinitionProviderInterface $actionDefinitionProvider
    ) {
        parent::__construct($projectDir, $legacyDir, $legacySessionName, $defaultSessionName, $legacyScopeState);
        $this->logger = $logger;
        $this->actionDefinitionProvider = $actionDefinitionProvider;
    }

    /**
     * @inheritDoc
     */
    public function getHandlerKey(): string
    {
        return 'record-view-definitions';
    }

    /**
     * Get record view defs array. Using Session swapping.
     * @param string $module
     * @param string $legacyModuleName
     * @param FieldDefinition $fieldDefinition
     * @return array
     */
    public function get(
        string $module,
        string $legacyModuleName,
        FieldDefinition $fieldDefinition
    ): array {

        $this->init();

        $metadata = $this->fetch($module, $legacyModuleName, $fieldDefinition);

        $this->close();

        return $metadata;
    }

    /**
     * Get record view defs array. No swapping.
     * @param string $module
     * @param string $legacyModuleName
     * @param FieldDefinition $fieldDefinition
     * @return array
     */
    public function fetch(
        string $module,
        string $legacyModuleName,
        FieldDefinition $fieldDefinition
    ): array
    {

        $metadata = [
            'templateMeta' => [],
            'topWidget' => [],
            'sidebarWidgets' => [],
            'actions' => [],
            'panels' => [],
        ];

        $detailViewDefs = $this->getDetailViewDefs($legacyModuleName);
        $editViewDefs = $this->getEditViewDefs($legacyModuleName);
        $vardefs = $fieldDefinition->getVardef();

        $this->addTemplateMeta($detailViewDefs, $metadata);
        $this->addTopWidgetConfig($detailViewDefs, $metadata);
        $this->addSidebarWidgetConfig($detailViewDefs, $metadata);
        $this->addPanelDefinitions($detailViewDefs, $editViewDefs, $vardefs, $metadata);
        $this->addActionConfig($module, $metadata);

        return $metadata;
    }

    /**
     * Get detail view defs from legacy
     * @param string $module
     * @return array
     */
    protected function getDetailViewDefs(string $module): array
    {
        /* @noinspection PhpIncludeInspection */
        require_once 'include/MVC/View/ViewFactory.php';

        /* @var ViewDetail $view */
        $view = ViewFactory::loadView(
            'detail',
            $module,
            BeanFactory::newBean($module)
        );

        $view->module = $module;

        $this->loadDetailViewMetadata($view);

        return $view->dv->defs;
    }

    /**
     * @param ViewDetail $view
     */
    protected function loadDetailViewMetadata(ViewDetail $view): void
    {
        /* @noinspection PhpIncludeInspection */
        require_once 'include/DetailView/DetailView2.php';
        $metadataFile = $view->getMetaDataFile();
        $view->dv = new DetailView2();
        $view->dv->ss =& $view->ss;
        $view->dv->setup($view->module, $view->bean, $metadataFile,
            get_custom_file_if_exists('include/DetailView/DetailView.tpl'));
    }

    /**
     * Get detail view defs from legacy
     * @param string $module
     * @return array
     */
    protected function getEditViewDefs(string $module): array
    {
        /* @noinspection PhpIncludeInspection */
        require_once 'include/MVC/View/ViewFactory.php';

        /* @var ViewEdit $view */
        $view = ViewFactory::loadView(
            'edit',
            $module,
            BeanFactory::newBean($module)
        );

        $view->module = $module;

        $this->loadEditViewMetadata($view);

        return $view->ev->defs;
    }

    /**
     * @param ViewEdit $view
     */
    protected function loadEditViewMetadata(ViewEdit $view): void
    {
        /* @noinspection PhpIncludeInspection */
        require_once 'include/EditView/EditView2.php';
        $metadataFile = $view->getMetaDataFile();
        $view->ev = new EditView();
        $view->ev->ss =& $view->ss;
        $view->ev->setup($view->module, $view->bean, $metadataFile);
    }

    /**
     * @param array $viewDefs
     * @param array $metadata
     */
    protected function addTemplateMeta(array $viewDefs, array &$metadata): void
    {
        $metadata['templateMeta']['maxColumns'] = $viewDefs['templateMeta']['maxColumns'] ?? 2;
        $metadata['templateMeta']['useTabs'] = $viewDefs['templateMeta']['useTabs'] ?? true;
        $metadata['templateMeta']['tabDefs'] = $viewDefs['templateMeta']['tabDefs'] ?? [];
    }

    /**
     * @param array $viewDefs
     * @param array $metadata
     */
    protected function addTopWidgetConfig(array $viewDefs, array &$metadata): void
    {
        $metadata['topWidget'] = $viewDefs['topWidget'] ?? [];
        $metadata['topWidget']['refreshOnRecordUpdate'] = $metadata['topWidget']['refreshOnRecordUpdate'] ?? true;
    }

    /**
     * @param array $viewDefs
     * @param array $metadata
     */
    protected function addSidebarWidgetConfig(array $viewDefs, array &$metadata): void
    {
        $metadata['sidebarWidgets'] = $viewDefs['sidebarWidgets'] ?? [];

        foreach ($metadata['sidebarWidgets'] as $index => $widget) {
            $metadata['sidebarWidgets'][$index]['refreshOnRecordUpdate'] = $widget['refreshOnRecordUpdate'] ?? true;
        }
    }

    /**
     * @param array $detailViewDefs
     * @param array $editViewDefs
     * @param array|null $vardefs
     * @param array $metadata
     */
    protected function addPanelDefinitions(
        array $detailViewDefs,
        array $editViewDefs,
        ?array &$vardefs,
        array &$metadata
    ): void {
        $detailViewDefs = $detailViewDefs ?? [];
        $panels = $detailViewDefs['panels'] ?? [];
        $editViewFields = $this->getCellFields($editViewDefs);

        foreach ($panels as $panelKey => $panel) {
            $panelRows = [];

            if (is_string($panel)) {
                $newRow = [
                    'cols' => []
                ];

                $definition = $this->getBaseFieldCellDefinition($panel);
                $this->addCell($newRow, $definition, $vardefs, $editViewFields);
                $panelRows[] = $newRow;

                // to append to the end
                $metadata['panels'][] = [
                    'key' => $panelKey,
                    'rows' => $panelRows
                ];

                continue;
            }

            foreach ($panel as $row) {
                $newRow = [
                    'cols' => []
                ];

                if (is_string($row)) {
                    $definition = $this->getBaseFieldCellDefinition($row);
                    $this->addCell($newRow, $definition, $vardefs, $editViewFields);
                    $panelRows[] = $newRow;

                    continue;
                }

                foreach ($row as $cell) {
                    $definition = $cell;

                    if (empty($cell)) {
                        continue;
                    }

                    if (is_string($cell) && isset($row['name'])) {
                        $definition = $row;
                        $this->addCell($newRow, $definition, $vardefs, $editViewFields);
                        continue;
                    }

                    if (is_string($cell)) {
                        $definition = $this->getBaseFieldCellDefinition($cell);
                    }

                    $this->addCell($newRow, $definition, $vardefs, $editViewFields);
                }
                $panelRows[] = $newRow;
            }

            // to append to the end
            $metadata['panels'][] = [
                'key' => $panelKey,
                'rows' => $panelRows
            ];
        }
    }

    /**
     * @param array $viewDefs
     * @return array
     */
    protected function getCellFields(array $viewDefs): array
    {
        $panels = $viewDefs['panels'] ?? [];
        $cells = [];

        foreach ($panels as $panelKey => $panel) {

            if (is_string($panel)) {

                $definition = $this->getBaseFieldCellDefinition($panel);
                $cells[$definition['name']] = $definition;

                continue;
            }

            foreach ($panel as $row) {

                if (is_string($row)) {
                    $definition = $this->getBaseFieldCellDefinition($row);
                    $cells[$definition['name']] = $definition;

                    continue;
                }

                foreach ($row as $cell) {
                    $definition = $cell;

                    if (empty($cell)) {
                        continue;
                    }

                    if (is_string($cell) && isset($row['name'])) {
                        $definition = $row;
                        $cells[$definition['name']] = $definition;
                        continue;
                    }

                    if (is_string($cell)) {
                        $definition = $this->getBaseFieldCellDefinition($cell);
                        $cells[$definition['name']] = $definition;
                    }

                    $cells[$definition['name']] = $definition;
                }
            }
        }

        return $cells;
    }

    /**
     * @param string $field
     * @return array
     */
    protected function getBaseFieldCellDefinition(string $field): array
    {
        $definition = array_merge([], $this->defaultDefinition);
        $definition['name'] = $field;

        return $definition;
    }

    /**
     * @param $newRow
     * @param $definition
     * @param $vardefs
     * @param array $editViewFields
     */
    protected function addCell(&$newRow, $definition, &$vardefs, array $editViewFields): void
    {
        $fieldName = $definition['name'] ?? '';
        if (empty($fieldName)) {
            return;
        }

        if (!isset($vardefs[$fieldName])) {
            $message = "RecordViewDefinitions: '$fieldName' not set on vardefs. Ignoring.";
            $this->logger->warning($message);

            return;
        }

        $definition = $this->buildFieldCell($definition, $vardefs);

        $definition = $this->mergeDisplayParams($definition);
        $definition = $this->mergeEditViewDefs($definition, $editViewFields);

        $newRow['cols'][] = $definition;
    }

    /**
     * Build list view column
     * @param $definition
     * @param array|null $vardefs
     * @return array
     */
    protected function buildFieldCell($definition, ?array &$vardefs): array
    {
        return $this->addFieldDefinition($vardefs, $definition['name'], $definition, $this->defaultDefinition);
    }

    /**
     * @param string $module
     * @param array $metadata
     */
    protected function addActionConfig(string $module, array &$metadata): void
    {
        $actions = $this->actionDefinitionProvider->getActions($module) ?? [];

        $metadata['actions'] = array_values($actions);
    }

    /**
     * @param $definition
     * @param array $editViewFields
     * @return mixed
     */
    protected function mergeEditViewDefs($definition, array $editViewFields)
    {
        if (isset($editViewFields[$definition['name']])) {
            $fieldDefinitions = $definition['fieldDefinition'] ?? [];
            $editViewDefinition = $editViewFields[$definition['name']] ?? [];
            $toMerge = [
                'required',
                'readOnly'
            ];

            foreach ($toMerge as $key) {
                $attribute = $editViewDefinition['displayParams'][$key] ?? null;
                if ($attribute !== null) {
                    $fieldDefinitions[$key] = $attribute;
                }
            }

            $definition['fieldDefinition'] = $fieldDefinitions;
        }

        return $definition;
    }

    /**
     * @param $definition
     * @return mixed
     */
    protected function mergeDisplayParams($definition)
    {
        $fieldDefinitions = $definition['fieldDefinition'] ?? [];
        $toMerge = [
            'required',
            'readOnly'
        ];

        foreach ($toMerge as $key) {
            $attribute = $definition['displayParams'][$key] ?? null;
            if ($attribute !== null) {
                $fieldDefinitions[$key] = $attribute;
            }
        }

        $definition['fieldDefinition'] = $fieldDefinitions;

        return $definition;
    }

}
