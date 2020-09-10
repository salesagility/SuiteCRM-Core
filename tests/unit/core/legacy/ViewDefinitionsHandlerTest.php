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
use SuiteCRM\Core\Legacy\AclHandler;
use SuiteCRM\Core\Legacy\AppListStringsHandler;
use SuiteCRM\Core\Legacy\FieldDefinitionsHandler;
use SuiteCRM\Core\Legacy\ModuleNameMapperHandler;
use SuiteCRM\Core\Legacy\ViewDefinitionsHandler;

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
                )
                :
                array
                {
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
            $logger
        );

        // Needed for aspect mock
        /* @noinspection PhpIncludeInspection */
        require_once 'include/ListView/ListViewDisplay.php';
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
}
