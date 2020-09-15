<?php

namespace SuiteCRM\Core\Legacy\ViewDefinitions;

use App\Entity\FieldDefinition;
use BeanFactory;
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
            'actions' => [],
            'panels' => [],
        ];

        $viewDefs = $this->getDetailViewDefs($legacyModuleName);
        $vardefs = $fieldDefinition->getVardef();

        $this->addTemplateMeta($viewDefs, $metadata);
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
        foreach ($viewDefs['panels'] as $panelKey => $panel) {
            $panelRows = [];
            foreach ($panel as $row) {
                $newRow = [
                    'cols' => []
                ];
                foreach ($row as $cell) {
                    $definition = $cell;

                    if (empty($cell)) {
                        continue;
                    }

                    if (is_string($cell)) {
                        $definition = $this->getBaseFieldCellDefinition($cell);
                    }

                    if (empty($definition['name'])) {
                        continue;
                    }

                    if (!isset($vardefs[$definition['name']])) {
                        $message = "RecordViewDefinitions: '${$definition['name']}' not set on vardefs. Ignoring.";
                        $this->logger->warning($message);
                        continue;
                    }

                    $definition = $this->buildFieldCell($definition, $vardefs);
                    $newRow['cols'][] = $definition;
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

        $view->preDisplay();

        return $view->dv->defs;
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
