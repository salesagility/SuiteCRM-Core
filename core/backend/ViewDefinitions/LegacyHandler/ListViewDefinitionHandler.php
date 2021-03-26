<?php


namespace App\ViewDefinitions\LegacyHandler;


use App\FieldDefinitions\Entity\FieldDefinition;
use App\Engine\LegacyHandler\LegacyHandler;
use App\Engine\LegacyHandler\LegacyScopeState;
use App\Process\Service\BulkActionDefinitionProviderInterface;
use App\Filters\Service\FilterDefinitionProviderInterface;
use App\Process\Service\LineActionDefinitionProviderInterface;
use App\ViewDefinitions\Service\ListViewSidebarWidgetDefinitionProviderInterface;
use Exception;
use ListViewFacade;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

class ListViewDefinitionHandler extends LegacyHandler
{
    use FieldDefinitionsInjectorTrait;

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
     * @var BulkActionDefinitionProviderInterface
     */
    private $bulkActionDefinitionProvider;

    /**
     * @var ListViewSidebarWidgetDefinitionProviderInterface
     */
    private $sidebarWidgetDefinitionProvider;

    /**
     * @var LineActionDefinitionProviderInterface
     */
    private $lineActionDefinitionProvider;
    /**
     * @var FilterDefinitionProviderInterface
     */
    private $filterDefinitionProvider;

    /**
     * RecordViewDefinitionHandler constructor.
     * @param string $projectDir
     * @param string $legacyDir
     * @param string $legacySessionName
     * @param string $defaultSessionName
     * @param LegacyScopeState $legacyScopeState
     * @param LoggerInterface $logger
     * @param BulkActionDefinitionProviderInterface $bulkActionDefinitionProvider
     * @param ListViewSidebarWidgetDefinitionProviderInterface $sidebarWidgetDefinitionProvider
     * @param LineActionDefinitionProviderInterface $lineActionDefinitionProvider
     * @param FilterDefinitionProviderInterface $filterDefinitionProvider
     */
    public function __construct(
        string $projectDir,
        string $legacyDir,
        string $legacySessionName,
        string $defaultSessionName,
        LegacyScopeState $legacyScopeState,
        LoggerInterface $logger,
        BulkActionDefinitionProviderInterface $bulkActionDefinitionProvider,
        ListViewSidebarWidgetDefinitionProviderInterface $sidebarWidgetDefinitionProvider,
        LineActionDefinitionProviderInterface $lineActionDefinitionProvider,
        FilterDefinitionProviderInterface $filterDefinitionProvider,
        SessionInterface $session
    ) {
        parent::__construct($projectDir, $legacyDir, $legacySessionName, $defaultSessionName, $legacyScopeState, $session);
        $this->logger = $logger;
        $this->bulkActionDefinitionProvider = $bulkActionDefinitionProvider;
        $this->sidebarWidgetDefinitionProvider = $sidebarWidgetDefinitionProvider;
        $this->lineActionDefinitionProvider = $lineActionDefinitionProvider;
        $this->filterDefinitionProvider = $filterDefinitionProvider;
    }

    /**
     * @inheritDoc
     */
    public function getHandlerKey(): string
    {
        return 'listview-view-definitions';
    }

    /**
     * Get record view defs array. Using Session swapping.
     * @param string $module
     * @param string $legacyModuleName
     * @param FieldDefinition $fieldDefinition
     * @return array
     * @throws Exception
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
     * Get list view defs array
     * @param string $module
     * @param string $legacyModuleName
     * @param FieldDefinition $fieldDefinition
     * @return array
     * @throws Exception
     */
    public function fetch(
        string $module,
        string $legacyModuleName,
        FieldDefinition $fieldDefinition
    ): array {
        $metadata = [
            'columns' => [],
            'bulkActions' => [],
            'lineActions' => [],
            'availableFilters' => [],
            'sidebarWidgets' => [],
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
        $metadata['sidebarWidgets'] = $this->sidebarWidgetDefinitionProvider->getSidebarWidgets($module);
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

}
