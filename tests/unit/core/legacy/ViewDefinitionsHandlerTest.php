<?php

namespace App\Tests\unit\core\legacy;

use App\Service\AclManagerInterface;
use App\Service\BulkActionDefinitionProvider;
use App\Service\ChartDefinitionProvider;
use App\Service\FilterDefinitionProvider;
use App\Service\FilterDefinitionProviderInterface;
use App\Service\LineActionDefinitionProvider;
use App\Service\RecordActionDefinitionProvider;
use App\Tests\UnitTester;
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

/**
 * Class ViewDefinitionsHandlerTest
 * @package App\Tests\unit\core\legacy
 */
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
     * @noinspection UntrustedInclusionInspection
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

        $recordViewActions = [
            'default' => [
                'actions' => [
                    'create' => [
                        'key' => 'create',
                        'labelKey' => 'LBL_NEW',
                        'acl' => ['edit'],
                        'mode' => ['detail']
                    ],
                    'edit' => [
                        'key' => 'edit',
                        'labelKey' => 'LBL_EDIT',
                        'acl' => ['edit'],
                        'mode' => ['detail']
                    ],
                    'delete' => [
                        'key' => 'delete',
                        'labelKey' => 'LBL_DELETE',
                        'asyncProcess' => true,
                        'acl' => ['delete'],
                        'mode' => ['detail']
                    ],
                ]
            ],
        ];


        $recordActionManager = new RecordActionDefinitionProvider(
            $recordViewActions,
            $aclManager
        );

        $recordViewDefinitionHandler = new RecordViewDefinitionHandler(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope,
            $logger,
            $recordActionManager
        );

        $subPanelDefinitionHandler = new SubPanelDefinitionHandler(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope,
            $moduleNameMapper,
            $fieldDefinitionsHandler
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
        require_once 'include/ListView/ListViewDisplay.php';
        require_once 'include/ListView/ListView.php';
        require_once 'include/SubPanel/SubPanel.php';
        require_once 'include/SubPanel/SubPanelDefinitions.php';
        require_once 'modules/Calls_Reschedule/Calls_Reschedule.php';
    }

    /**
     * Test List view defs retrieval
     * @throws Exception
     */
    public function testListViewDefs(): void
    {
        $listViewDefs = $this->viewDefinitionHandler->getListViewDef('accounts');
        ViewDefinitionsHandlerTest::assertNotNull($listViewDefs);
        ViewDefinitionsHandlerTest::assertNotNull($listViewDefs->getListView());
        ViewDefinitionsHandlerTest::assertIsArray($listViewDefs->getListView());
        ViewDefinitionsHandlerTest::assertNotEmpty($listViewDefs->getListView());

        $firstColumn = $listViewDefs->getListView()['columns'][0];
        ViewDefinitionsHandlerTest::assertIsArray($firstColumn);
        ViewDefinitionsHandlerTest::assertNotEmpty($firstColumn);

        ViewDefinitionsHandlerTest::assertArrayHasKey('name', $firstColumn);
        ViewDefinitionsHandlerTest::assertArrayHasKey('label', $firstColumn);
        ViewDefinitionsHandlerTest::assertArrayHasKey('link', $firstColumn);
        ViewDefinitionsHandlerTest::assertIsBool($firstColumn['link']);
        ViewDefinitionsHandlerTest::assertArrayHasKey('sortable', $firstColumn);
        ViewDefinitionsHandlerTest::assertIsBool($firstColumn['sortable']);
        ViewDefinitionsHandlerTest::assertArrayHasKey('fieldDefinition', $firstColumn);
        ViewDefinitionsHandlerTest::assertIsArray($firstColumn['fieldDefinition']);

        ViewDefinitionsHandlerTest::assertArrayHasKey('name', $firstColumn['fieldDefinition']);
        ViewDefinitionsHandlerTest::assertArrayHasKey('type', $firstColumn['fieldDefinition']);
        ViewDefinitionsHandlerTest::assertArrayHasKey('vname', $firstColumn['fieldDefinition']);

        $actions = $listViewDefs->getListView()['bulkActions'];
        ViewDefinitionsHandlerTest::assertIsArray($actions);
        ViewDefinitionsHandlerTest::assertNotEmpty($actions);

        ViewDefinitionsHandlerTest::assertArrayHasKey('delete', $actions);
        ViewDefinitionsHandlerTest::assertSame([
            'key' => 'delete',
            'labelKey' => 'LBL_DELETE',
            'params' => [
                'min' => 1,
                'max' => 5
            ],
            'acl' => ['delete']
        ], $actions['delete']);

        ViewDefinitionsHandlerTest::assertArrayHasKey('export', $actions);
        ViewDefinitionsHandlerTest::assertSame([
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
        ViewDefinitionsHandlerTest::assertNotNull($searchDefs);
        ViewDefinitionsHandlerTest::assertNotNull($searchDefs->getSearch());
        ViewDefinitionsHandlerTest::assertIsArray($searchDefs->getSearch());
        ViewDefinitionsHandlerTest::assertNotEmpty($searchDefs->getSearch());
        ViewDefinitionsHandlerTest::assertArrayHasKey('layout', $searchDefs->getSearch());

        ViewDefinitionsHandlerTest::assertNotNull($searchDefs->getSearch()['layout']);
        ViewDefinitionsHandlerTest::assertIsArray($searchDefs->getSearch()['layout']);
        ViewDefinitionsHandlerTest::assertNotEmpty($searchDefs->getSearch()['layout']);

        ViewDefinitionsHandlerTest::assertArrayHasKey('basic', $searchDefs->getSearch()['layout']);
        ViewDefinitionsHandlerTest::assertNotNull($searchDefs->getSearch()['layout']['basic']);
        ViewDefinitionsHandlerTest::assertIsArray($searchDefs->getSearch()['layout']['basic']);
        ViewDefinitionsHandlerTest::assertNotEmpty($searchDefs->getSearch()['layout']['basic']);

        $first = array_pop($searchDefs->getSearch()['layout']['basic']);
        ViewDefinitionsHandlerTest::assertIsArray($first);
        ViewDefinitionsHandlerTest::assertNotEmpty($first);

        ViewDefinitionsHandlerTest::assertArrayHasKey('name', $first);

        ViewDefinitionsHandlerTest::assertArrayHasKey('advanced', $searchDefs->getSearch()['layout']);
        ViewDefinitionsHandlerTest::assertNotNull($searchDefs->getSearch()['layout']['advanced']);
        ViewDefinitionsHandlerTest::assertIsArray($searchDefs->getSearch()['layout']['advanced']);
        ViewDefinitionsHandlerTest::assertNotEmpty($searchDefs->getSearch()['layout']['advanced']);

        $first = array_pop($searchDefs->getSearch()['layout']['advanced']);
        ViewDefinitionsHandlerTest::assertIsArray($first);
        ViewDefinitionsHandlerTest::assertNotEmpty($first);

        ViewDefinitionsHandlerTest::assertArrayHasKey('name', $first);
    }

    /**
     * Test search defs formats for simplified configuration
     * @throws Exception
     */
    public function testSearchDefsFormatForSimpleConfiguration(): void
    {
        $searchDefs = $this->viewDefinitionHandler->getSearchDefs('workflow');
        ViewDefinitionsHandlerTest::assertNotNull($searchDefs);
        ViewDefinitionsHandlerTest::assertNotNull($searchDefs->getSearch());
        ViewDefinitionsHandlerTest::assertIsArray($searchDefs->getSearch());
        ViewDefinitionsHandlerTest::assertNotEmpty($searchDefs->getSearch());
        ViewDefinitionsHandlerTest::assertArrayHasKey('layout', $searchDefs->getSearch());

        ViewDefinitionsHandlerTest::assertNotNull($searchDefs->getSearch()['layout']);
        ViewDefinitionsHandlerTest::assertIsArray($searchDefs->getSearch()['layout']);
        ViewDefinitionsHandlerTest::assertNotEmpty($searchDefs->getSearch()['layout']);

        ViewDefinitionsHandlerTest::assertArrayHasKey('advanced', $searchDefs->getSearch()['layout']);
        ViewDefinitionsHandlerTest::assertNotNull($searchDefs->getSearch()['layout']['advanced']);
        ViewDefinitionsHandlerTest::assertIsArray($searchDefs->getSearch()['layout']['advanced']);
        ViewDefinitionsHandlerTest::assertNotEmpty($searchDefs->getSearch()['layout']['advanced']);

        $first = array_pop($searchDefs->getSearch()['layout']['advanced']);
        ViewDefinitionsHandlerTest::assertIsArray($first);
        ViewDefinitionsHandlerTest::assertNotEmpty($first);

        ViewDefinitionsHandlerTest::assertArrayHasKey('name', $first);
    }

    /**
     * Test record view defs retrieval
     * @throws Exception
     */
    public function testRecordViewDefs(): void
    {
        $recordViewDefs = $this->viewDefinitionHandler->getRecordViewDefs('accounts');

        ViewDefinitionsHandlerTest::assertNotNull($recordViewDefs);
        ViewDefinitionsHandlerTest::assertNotNull($recordViewDefs->getRecordView());
        ViewDefinitionsHandlerTest::assertIsArray($recordViewDefs->getRecordView());
        ViewDefinitionsHandlerTest::assertNotEmpty($recordViewDefs->getRecordView());
        ViewDefinitionsHandlerTest::assertArrayHasKey('templateMeta', $recordViewDefs->getRecordView());
        ViewDefinitionsHandlerTest::assertArrayHasKey('actions', $recordViewDefs->getRecordView());
        ViewDefinitionsHandlerTest::assertArrayHasKey('panels', $recordViewDefs->getRecordView());

        ViewDefinitionsHandlerTest::assertNotNull($recordViewDefs->getRecordView()['templateMeta']);
        ViewDefinitionsHandlerTest::assertIsArray($recordViewDefs->getRecordView()['templateMeta']);
        ViewDefinitionsHandlerTest::assertNotEmpty($recordViewDefs->getRecordView()['templateMeta']);

        ViewDefinitionsHandlerTest::assertArrayHasKey('maxColumns', $recordViewDefs->getRecordView()['templateMeta']);
        ViewDefinitionsHandlerTest::assertArrayHasKey('useTabs', $recordViewDefs->getRecordView()['templateMeta']);
        ViewDefinitionsHandlerTest::assertArrayHasKey('tabDefs', $recordViewDefs->getRecordView()['templateMeta']);

        ViewDefinitionsHandlerTest::assertNotNull($recordViewDefs->getRecordView()['panels']);
        ViewDefinitionsHandlerTest::assertIsArray($recordViewDefs->getRecordView()['panels']);
        ViewDefinitionsHandlerTest::assertNotEmpty($recordViewDefs->getRecordView()['panels']);

        $panels = $recordViewDefs->getRecordView()['panels'];
        $firstPanel = $panels[0];

        ViewDefinitionsHandlerTest::assertIsArray($firstPanel);
        ViewDefinitionsHandlerTest::assertNotEmpty($firstPanel);
        ViewDefinitionsHandlerTest::assertArrayHasKey('key', $firstPanel);
        ViewDefinitionsHandlerTest::assertArrayHasKey('key', $firstPanel);
        ViewDefinitionsHandlerTest::assertNotEmpty($firstPanel['rows']);

        $firstRow = $firstPanel['rows'][0];
        ViewDefinitionsHandlerTest::assertIsArray($firstRow);
        ViewDefinitionsHandlerTest::assertNotEmpty($firstRow);
        ViewDefinitionsHandlerTest::assertArrayHasKey('cols', $firstRow);
        ViewDefinitionsHandlerTest::assertNotEmpty($firstRow['cols']);

        $firstCol = $firstRow['cols'][0];
        ViewDefinitionsHandlerTest::assertIsArray($firstCol);
        ViewDefinitionsHandlerTest::assertNotEmpty($firstCol);
        ViewDefinitionsHandlerTest::assertArrayHasKey('fieldDefinition', $firstCol);
        ViewDefinitionsHandlerTest::assertArrayHasKey('name', $firstCol);
        ViewDefinitionsHandlerTest::assertArrayHasKey('label', $firstCol);
        ViewDefinitionsHandlerTest::assertNotEmpty($firstCol['fieldDefinition']);
    }

    /**
     * Test subpanel defs retrieval
     * @throws Exception
     */
    public function testSubPanelDefs(): void
    {
        $viewDef = $this->viewDefinitionHandler->getViewDefs('accounts', ['subPanel']);

        ViewDefinitionsHandlerTest::assertNotNull($viewDef);
        ViewDefinitionsHandlerTest::assertNotEmpty($viewDef);
        ViewDefinitionsHandlerTest::assertIsObject($viewDef);

        $subPanels = $viewDef->subpanel;
        ViewDefinitionsHandlerTest::assertIsArray($subPanels);

        $activities = $subPanels['activities'];

        ViewDefinitionsHandlerTest::assertIsArray($activities);
        ViewDefinitionsHandlerTest::assertNotEmpty($activities);
        ViewDefinitionsHandlerTest::assertArrayHasKey('title_key', $activities);
        ViewDefinitionsHandlerTest::assertArrayHasKey('module', $activities);
        ViewDefinitionsHandlerTest::assertArrayHasKey('top_buttons', $activities);
        ViewDefinitionsHandlerTest::assertNotEmpty($activities['top_buttons']);

        ViewDefinitionsHandlerTest::assertArrayHasKey('key', $activities['top_buttons'][0]);
        ViewDefinitionsHandlerTest::assertNotEmpty($activities['top_buttons'][0]['key']);
        ViewDefinitionsHandlerTest::assertArrayHasKey('labelKey', $activities['top_buttons'][0]);
        ViewDefinitionsHandlerTest::assertNotEmpty($activities['top_buttons'][0]['labelKey']);

        ViewDefinitionsHandlerTest::assertArrayHasKey('columns', $activities);
        ViewDefinitionsHandlerTest::assertNotEmpty($activities['columns']);

        ViewDefinitionsHandlerTest::assertArrayHasKey('columns', $activities);
        ViewDefinitionsHandlerTest::assertNotEmpty($activities['columns']);
        ViewDefinitionsHandlerTest::assertNotEmpty($activities['columns'][0]);
        ViewDefinitionsHandlerTest::assertArrayHasKey('name', $activities['columns'][0]);
        ViewDefinitionsHandlerTest::assertArrayHasKey('label', $activities['columns'][0]);
        ViewDefinitionsHandlerTest::assertArrayHasKey('fieldDefinition', $activities['columns'][0]);
        ViewDefinitionsHandlerTest::assertArrayHasKey('type', $activities['columns'][0]);
    }
}
