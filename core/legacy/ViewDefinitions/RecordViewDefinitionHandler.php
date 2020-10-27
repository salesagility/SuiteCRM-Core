<?php

namespace SuiteCRM\Core\Legacy\ViewDefinitions;

use App\Entity\FieldDefinition;
use BeanFactory;
use DetailView2;
use Exception;
use Psr\Log\LoggerInterface;
use SuiteCRM\Core\Legacy\LegacyHandler;
use SuiteCRM\Core\Legacy\LegacyScopeState;
use ViewDetail;
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
     * RecordViewDefinitionHandler constructor.
     * @param string $projectDir
     * @param string $legacyDir
     * @param string $legacySessionName
     * @param string $defaultSessionName
     * @param LegacyScopeState $legacyScopeState
     * @param LoggerInterface $logger
     */
    public function __construct(
        string $projectDir,
        string $legacyDir,
        string $legacySessionName,
        string $defaultSessionName,
        LegacyScopeState $legacyScopeState,
        LoggerInterface $logger
    ) {
        parent::__construct($projectDir, $legacyDir, $legacySessionName, $defaultSessionName, $legacyScopeState);
        $this->logger = $logger;
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
     * @param string $legacyModuleName
     * @param FieldDefinition $fieldDefinition
     * @return array
     * @throws Exception
     */
    public function get(
        string $legacyModuleName,
        FieldDefinition $fieldDefinition
    ): array {

        $this->init();

        $metadata = $this->fetch($legacyModuleName, $fieldDefinition);

        $this->close();

        return $metadata;
    }

    /**
     * Get record view defs array. No swapping.
     * @param string $legacyModuleName
     * @param FieldDefinition $fieldDefinition
     * @return array
     * @throws Exception
     */
    public function fetch(
        string $legacyModuleName,
        FieldDefinition $fieldDefinition
    ): array {

        $metadata = [
            'templateMeta' => [],
            'topWidget' => [],
            'actions' => [],
            'panels' => [],
        ];

        $viewDefs = $this->getDetailViewDefs($legacyModuleName);
        $vardefs = $fieldDefinition->getVardef();

        $this->addTemplateMeta($viewDefs, $metadata);
        $this->addTopWidgetConfig($viewDefs, $metadata);
        $this->addPanelDefinitions($viewDefs, $vardefs, $metadata);

        return $metadata;
    }

    /**
     * @param array $viewDefs
     * @param array|null $vardefs
     * @param array $metadata
     */
    protected function addPanelDefinitions(array $viewDefs, ?array &$vardefs, array &$metadata): void
    {
        $viewDefs = $viewDefs ?? [];
        $panels = $viewDefs['panels'] ?? [];

        foreach ($panels as $panelKey => $panel) {
            $panelRows = [];

            if (is_string($panel)) {
                $newRow = [
                    'cols' => []
                ];

                $definition = $this->getBaseFieldCellDefinition($panel);
                $this->addCell($newRow, $definition, $vardefs);
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
                    $this->addCell($newRow, $definition, $vardefs);
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
                        $this->addCell($newRow, $definition, $vardefs);
                        continue;
                    }

                    if (is_string($cell)) {
                        $definition = $this->getBaseFieldCellDefinition($cell);
                    }

                    $this->addCell($newRow, $definition, $vardefs);
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
     * @param $newRow
     * @param $definition
     * @param $vardefs
     */
    protected function addCell(&$newRow, $definition, &$vardefs): void
    {
        if (empty($definition['name'])) {
            return;
        }

        if (!isset($vardefs[$definition['name']])) {
            $message = "RecordViewDefinitions: '${$definition['name']}' not set on vardefs. Ignoring.";
            $this->logger->warning($message);

            return;
        }

        $definition = $this->buildFieldCell($definition, $vardefs);
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

        $this->loadMetadata($view);

        return $view->dv->defs;
    }

    /**
     * @param ViewDetail $view
     */
    protected function loadMetadata(ViewDetail $view): void
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
}
