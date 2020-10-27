<?php

namespace App\Tests;

use App\Service\AclManagerInterface;
use App\Service\BulkActionDefinitionProvider;
use App\Service\ChartDefinitionProvider;
use App\Service\FilterDefinitionProvider;
use App\Service\FilterDefinitionProviderInterface;
use App\Service\LineActionDefinitionProvider;
use Codeception\Test\Unit;
use Exception;
use Monolog\Logger;
use Psr\Log\LoggerInterface;
use App\Legacy\AclHandler;
use App\Legacy\AppListStringsHandler;
use App\Legacy\FieldDefinitionsHandler;
use App\Legacy\ModuleNameMapperHandler;
use App\Legacy\ViewDefinitions\RecordViewDefinitionHandler;
use App\Legacy\ViewDefinitions\SubPanelDefinitionHandler;
use App\Legacy\ViewDefinitionsHandler;

final class ViewDefinitionsHandlerTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var ViewDefinitionsHandler
     */
    private $viewDefinitionHandler;

    /**
     * @throws Exception
     */
    protected function _before(): void
    {
        $projectDir = $this->tester->getProjectDir();
        $legacyDir = $this->tester->getLegacyDir();
        $legacySessionName = $this->tester->getLegacySessionName();
        $defaultSessionName = $this->tester->getDefaultSessionName();

        $legacyScope = $this->tester->getLegacyScope();

        $moduleNameMapper = new ModuleNameMapperHandler(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope
        );

        $fieldDefinitionsHandler = new FieldDefinitionsHandler(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope,
            $moduleNameMapper
        );

        $listViewBulkActions = [
            'default' => [
                'actions' => [
                    'delete' => [
                        'key' => 'delete',
                        'labelKey' => 'LBL_DELETE',
                        'params' => [
                            'min' => 1,
                            'max' => 5
                        ],
                        'acl' => ['delete']
                    ],
                    'export' => [
                        'key' => 'export',
                        'labelKey' => 'LBL_EXPORT',
                        'params' => [
                            'min' => 1,
                            'max' => 5
                        ],
                        'acl' => ['export']
                    ],
                ]
            ],
            'modules' => [
            ]
        ];

        $chartDefinitions = [
            'modules' => [
                'Accounts' => [
                    'key' => 'annual_revenue',
                    'labelKey' => 'ANNUAL_REVENUE_BY_ACCOUNTS',
                    'type' => 'line',
                ],
                'Opportunities' => [
                    'key' => 'pipeline_by_sales_state',
                    'labelKey' => 'PIPELINE_BY_SALES_STAGE',
                    'params' => 'bar',
                ],
                'Leads' => [
                    'key' => 'leads_by_source',
                    'labelKey' => 'LEADS_BY_SOURCE',
                    'params' => 'line',
                ],
            ],
        ];

        /** @var AclManagerInterface $aclManager */
        $aclManager = $this->make(
            AclHandler::class,
            [
                'checkAccess' => static function (
                    /** @noinspection PhpUnusedParameterInspection */
                    string $module,
                    string $action,
                    bool $isOwner = false
                ): bool {
                    return true;
                }
            ]
        );

        $bulkActionProvider = new BulkActionDefinitionProvider(
            $listViewBulkActions,
            $aclManager
        );

        $chartDefinitionProvider = new ChartDefinitionProvider(
            $chartDefinitions
        );

        $appListStrings = new AppListStringsHandler(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope
        );

        $lineActionDefinitionProvider = new LineActionDefinitionProvider(
            [],
            $aclManager,
            $fieldDefinitionsHandler,
            $moduleNameMapper,
            $appListStrings
        );

        /** @var FilterDefinitionProviderInterface $filterDefinitionHandler */
        $filterDefinitionHandler = $this->make(
            FilterDefinitionProvider::class,
            [
                'getFilters' => static function (

                    /** @noinspection PhpUnusedParameterInspection */
                    string $module
                ):
                array {
                    $result = [];
                    $result[] = [
                        'id' => '1',
                        'name' => 'Saved Filter 1',
                        'contents' => 'dummy contents'
                    ];

                    return $result;
                }
            ]
        );

        /** @var LoggerInterface $logger */
        $logger = $this->make(
            Logger::class,
            [
                'warning' => static function (
                    string $module
                ): void {
                }
            ]
        );

        $recordViewDefinitionHandler = new RecordViewDefinitionHandler(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope,
            $logger
        );


        $subpanelKeyMap = [];

        $subPanelDefinitionHandler = new SubPanelDefinitionHandler(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope,
            $moduleNameMapper,
            $fieldDefinitionsHandler,
            $subpanelKeyMap
        );

        $this->viewDefinitionHandler = new ViewDefinitionsHandler(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope,
            $moduleNameMapper,
            $fieldDefinitionsHandler,
            $bulkActionProvider,
            $chartDefinitionProvider,
            $lineActionDefinitionProvider,
            $filterDefinitionHandler,
            $recordViewDefinitionHandler,
            $logger,
            $subPanelDefinitionHandler
        );

        // Needed for aspect mock
        /* @noinspection PhpIncludeInspection */
        require_once 'include/ListView/ListViewDisplay.php';
        /* @noinspection PhpIncludeInspection */
        require_once 'include/ListView/ListView.php';
        /* @noinspection PhpIncludeInspection */
        require_once 'modules/Calls_Reschedule/Calls_Reschedule.php';
    }

    /**
     * Test List view defs retrieval
     * @throws Exception
     */
    public function testListViewDefs(): void
    {
        $listViewDefs = $this->viewDefinitionHandler->getListViewDef('accounts');
        static::assertNotNull($listViewDefs);
        static::assertNotNull($listViewDefs->getListView());
        static::assertIsArray($listViewDefs->getListView());
        static::assertNotEmpty($listViewDefs->getListView());

        $firstColumn = $listViewDefs->getListView()['columns'][0];
        static::assertIsArray($firstColumn);
        static::assertNotEmpty($firstColumn);

        static::assertArrayHasKey('name', $firstColumn);
        static::assertArrayHasKey('label', $firstColumn);
        static::assertArrayHasKey('link', $firstColumn);
        static::assertIsBool($firstColumn['link']);
        static::assertArrayHasKey('sortable', $firstColumn);
        static::assertIsBool($firstColumn['sortable']);
        static::assertArrayHasKey('fieldDefinition', $firstColumn);
        static::assertIsArray($firstColumn['fieldDefinition']);

        static::assertArrayHasKey('name', $firstColumn['fieldDefinition']);
        static::assertArrayHasKey('type', $firstColumn['fieldDefinition']);
        static::assertArrayHasKey('vname', $firstColumn['fieldDefinition']);

        $actions = $listViewDefs->getListView()['bulkActions'];
        static::assertIsArray($actions);
        static::assertNotEmpty($actions);

        static::assertArrayHasKey('delete', $actions);
        static::assertSame([
            'key' => 'delete',
            'labelKey' => 'LBL_DELETE',
            'params' => [
                'min' => 1,
                'max' => 5
            ],
            'acl' => ['delete']
        ], $actions['delete']);

        static::assertArrayHasKey('export', $actions);
        static::assertSame([
            'key' => 'export',
            'labelKey' => 'LBL_EXPORT',
            'params' => [
                'min' => 1,
                'max' => 5
            ],
            'acl' => ['export']
        ], $actions['export']);
    }

    /**
     * Test search defs retrieval
     * @throws Exception
     */
    public function testSearchDefs(): void
    {
        $searchDefs = $this->viewDefinitionHandler->getSearchDefs('accounts');
        static::assertNotNull($searchDefs);
        static::assertNotNull($searchDefs->getSearch());
        static::assertIsArray($searchDefs->getSearch());
        static::assertNotEmpty($searchDefs->getSearch());
        static::assertArrayHasKey('layout', $searchDefs->getSearch());

        static::assertNotNull($searchDefs->getSearch()['layout']);
        static::assertIsArray($searchDefs->getSearch()['layout']);
        static::assertNotEmpty($searchDefs->getSearch()['layout']);

        static::assertArrayHasKey('basic', $searchDefs->getSearch()['layout']);
        static::assertNotNull($searchDefs->getSearch()['layout']['basic']);
        static::assertIsArray($searchDefs->getSearch()['layout']['basic']);
        static::assertNotEmpty($searchDefs->getSearch()['layout']['basic']);

        $first = array_pop($searchDefs->getSearch()['layout']['basic']);
        static::assertIsArray($first);
        static::assertNotEmpty($first);

        static::assertArrayHasKey('name', $first);

        static::assertArrayHasKey('advanced', $searchDefs->getSearch()['layout']);
        static::assertNotNull($searchDefs->getSearch()['layout']['advanced']);
        static::assertIsArray($searchDefs->getSearch()['layout']['advanced']);
        static::assertNotEmpty($searchDefs->getSearch()['layout']['advanced']);

        $first = array_pop($searchDefs->getSearch()['layout']['advanced']);
        static::assertIsArray($first);
        static::assertNotEmpty($first);

        static::assertArrayHasKey('name', $first);
    }

    /**
     * Test search defs formats for simplified configuration
     * @throws Exception
     */
    public function testSearchDefsFormatForSimpleConfiguration(): void
    {
        $searchDefs = $this->viewDefinitionHandler->getSearchDefs('workflow');
        static::assertNotNull($searchDefs);
        static::assertNotNull($searchDefs->getSearch());
        static::assertIsArray($searchDefs->getSearch());
        static::assertNotEmpty($searchDefs->getSearch());
        static::assertArrayHasKey('layout', $searchDefs->getSearch());

        static::assertNotNull($searchDefs->getSearch()['layout']);
        static::assertIsArray($searchDefs->getSearch()['layout']);
        static::assertNotEmpty($searchDefs->getSearch()['layout']);

        static::assertArrayHasKey('advanced', $searchDefs->getSearch()['layout']);
        static::assertNotNull($searchDefs->getSearch()['layout']['advanced']);
        static::assertIsArray($searchDefs->getSearch()['layout']['advanced']);
        static::assertNotEmpty($searchDefs->getSearch()['layout']['advanced']);

        $first = array_pop($searchDefs->getSearch()['layout']['advanced']);
        static::assertIsArray($first);
        static::assertNotEmpty($first);

        static::assertArrayHasKey('name', $first);
    }

    /**
     * Test record view defs retrieval
     * @throws Exception
     */
    public function testRecordViewDefs(): void
    {
        $recordViewDefs = $this->viewDefinitionHandler->getRecordViewDefs('accounts');
        static::assertNotNull($recordViewDefs);
        static::assertNotNull($recordViewDefs->getRecordView());
        static::assertIsArray($recordViewDefs->getRecordView());
        static::assertNotEmpty($recordViewDefs->getRecordView());
        static::assertArrayHasKey('templateMeta', $recordViewDefs->getRecordView());
        static::assertArrayHasKey('actions', $recordViewDefs->getRecordView());
        static::assertArrayHasKey('panels', $recordViewDefs->getRecordView());

        static::assertNotNull($recordViewDefs->getRecordView()['templateMeta']);
        static::assertIsArray($recordViewDefs->getRecordView()['templateMeta']);
        static::assertNotEmpty($recordViewDefs->getRecordView()['templateMeta']);

        static::assertArrayHasKey('maxColumns', $recordViewDefs->getRecordView()['templateMeta']);
        static::assertArrayHasKey('useTabs', $recordViewDefs->getRecordView()['templateMeta']);
        static::assertArrayHasKey('tabDefs', $recordViewDefs->getRecordView()['templateMeta']);

        static::assertNotNull($recordViewDefs->getRecordView()['panels']);
        static::assertIsArray($recordViewDefs->getRecordView()['panels']);
        static::assertNotEmpty($recordViewDefs->getRecordView()['panels']);

        $panels = $recordViewDefs->getRecordView()['panels'];
        $firstPanel = $panels[0];

        static::assertIsArray($firstPanel);
        static::assertNotEmpty($firstPanel);
        static::assertArrayHasKey('key', $firstPanel);
        static::assertArrayHasKey('key', $firstPanel);
        static::assertNotEmpty($firstPanel['rows']);

        $firstRow = $firstPanel['rows'][0];
        static::assertIsArray($firstRow);
        static::assertNotEmpty($firstRow);
        static::assertArrayHasKey('cols', $firstRow);
        static::assertNotEmpty($firstRow['cols']);

        $firstCol = $firstRow['cols'][0];
        static::assertIsArray($firstCol);
        static::assertNotEmpty($firstCol);
        static::assertArrayHasKey('fieldDefinition', $firstCol);
        static::assertArrayHasKey('name', $firstCol);
        static::assertArrayHasKey('label', $firstCol);
        static::assertNotEmpty($firstCol['fieldDefinition']);
    }

    /**
     * Test subpanel defs retrieval
     * @throws Exception
     */
    public function testSubPanelDefs(): void
    {
        $viewDef = $this->viewDefinitionHandler->getViewDefs('accounts', ['subPanel']);

        static::assertNotNull($viewDef);
        static::assertNotEmpty($viewDef);
        static::assertIsObject($viewDef);

        $subPanels = $viewDef->subpanel;
        static::assertIsArray($subPanels);

        $activities = $subPanels['activities'];

        static::assertIsArray($activities);
        static::assertNotEmpty($activities);
        static::assertArrayHasKey('title_key', $activities);
        static::assertArrayHasKey('module', $activities);
        static::assertArrayHasKey('top_buttons', $activities);
        static::assertNotEmpty($activities['top_buttons']);

        static::assertArrayHasKey('key', $activities['top_buttons'][0]);
        static::assertNotEmpty($activities['top_buttons'][0]['key']);
        static::assertArrayHasKey('labelKey', $activities['top_buttons'][0]);
        static::assertNotEmpty($activities['top_buttons'][0]['labelKey']);

        static::assertArrayHasKey('columns', $activities);
        static::assertNotEmpty($activities['columns']);

        static::assertArrayHasKey('columns', $activities);
        static::assertNotEmpty($activities['columns']);
        static::assertNotEmpty($activities['columns'][0]);
        static::assertArrayHasKey('name', $activities['columns'][0]);
        static::assertArrayHasKey('label', $activities['columns'][0]);
        static::assertArrayHasKey('fieldDefinition', $activities['columns'][0]);
        static::assertArrayHasKey('type', $activities['columns'][0]);
    }
}
