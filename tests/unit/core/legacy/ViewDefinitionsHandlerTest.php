<?php
/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2021 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see http://www.gnu.org/licenses.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */


namespace App\Tests\unit\core\legacy;

use App\Engine\LegacyHandler\AclHandler;
use App\Languages\LegacyHandler\AppListStringsHandler;
use App\FieldDefinitions\LegacyHandler\FieldDefinitionMappers;
use App\FieldDefinitions\LegacyHandler\GroupedFieldDefinitionMapper;
use App\FieldDefinitions\LegacyHandler\LegacyGroupedFieldDefinitionMapper;
use App\FieldDefinitions\LegacyHandler\FieldDefinitionsHandler;
use App\Module\LegacyHandler\ModuleNameMapperHandler;
use App\ViewDefinitions\LegacyHandler\ListViewDefinitionHandler;
use App\ViewDefinitions\LegacyHandler\RecordView\RecordViewGroupTypeMapper;
use App\ViewDefinitions\LegacyHandler\RecordViewDefinitionHandler;
use App\ViewDefinitions\LegacyHandler\SubPanelDefinitionHandler;
use App\ViewDefinitions\LegacyHandler\ViewDefinitionMappers;
use App\Engine\Service\AclManagerInterface;
use App\Process\Service\BulkActionDefinitionProvider;
use App\Filters\Service\FilterDefinitionProvider;
use App\Filters\Service\FilterDefinitionProviderInterface;
use App\Process\Service\LineActionDefinitionProvider;
use App\ViewDefinitions\Service\ListViewSidebarWidgetDefinitionProvider;
use App\Data\Service\RecordActionDefinitionProvider;
use App\Tests\_mock\Mock\core\legacy\ViewDefinitionsHandlerMock;
use App\Tests\UnitTester;
use ArrayObject;
use Codeception\Test\Unit;
use Exception;
use Monolog\Logger;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Storage\MockArraySessionStorage;

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
     * @var ViewDefinitionsHandlerMock
     */
    private $viewDefinitionHandler;

    /**
     * @throws Exception
     * @noinspection UntrustedInclusionInspection
     */
    protected function _before(): void
    {
        $session = new Session(new MockArraySessionStorage('PHPSESSID'));
        $session->start();

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
            $legacyScope,
            $session
        );

        $groupedFieldTypesMap = [
            'address' => [
                'layout' => [
                    'street',
                    'postalcode',
                    'city',
                    'state',
                    'country'
                ],
                'display' => 'vertical',
                'showLabel' => ['edit']
            ]
        ];

        $groupeFieldMapper = new GroupedFieldDefinitionMapper($groupedFieldTypesMap);
        $obj = new ArrayObject([
            $groupeFieldMapper,
            new LegacyGroupedFieldDefinitionMapper()
        ]);
        $it = $obj->getIterator();

        $fieldDefinitionMapper = new FieldDefinitionMappers($it);


        $fieldDefinitionsHandler = new FieldDefinitionsHandler(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope,
            $moduleNameMapper,
            $fieldDefinitionMapper,
            $session
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

        $sidebarWidgetDefinitionProvider = new ListViewSidebarWidgetDefinitionProvider(
            $chartDefinitions,
            $aclManager
        );

        $appListStrings = new AppListStringsHandler(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope,
            $session
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
            $recordActionManager,
            $session
        );

        $subPanelDefinitionHandler = new SubPanelDefinitionHandler(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope,
            $moduleNameMapper,
            $fieldDefinitionsHandler,
            $session
        );

        $listViewDefinitionHandler = new ListViewDefinitionHandler(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope,
            $logger,
            $bulkActionProvider,
            $sidebarWidgetDefinitionProvider,
            $lineActionDefinitionProvider,
            $filterDefinitionHandler,
            $session
        );

        $obj = new ArrayObject([
            new RecordViewGroupTypeMapper($groupeFieldMapper),
        ]);
        $it = $obj->getIterator();

        $viewDefinitionMapper = new ViewDefinitionMappers($it);

        $this->viewDefinitionHandler = new ViewDefinitionsHandlerMock(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope,
            $moduleNameMapper,
            $fieldDefinitionsHandler,
            $recordViewDefinitionHandler,
            $subPanelDefinitionHandler,
            $listViewDefinitionHandler,
            $logger,
            $viewDefinitionMapper,
            $session
        );

        // Needed for aspect mock
        /* @noinspection PhpIncludeInspection */
        require_once 'include/ListView/ListViewDisplay.php';
        /* @noinspection PhpIncludeInspection */
        require_once 'include/ListView/ListView.php';
        /* @noinspection PhpIncludeInspection */
        require_once 'include/SubPanel/SubPanel.php';
        /* @noinspection PhpIncludeInspection */
        require_once 'include/SubPanel/SubPanelDefinitions.php';
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
        self::assertNotNull($listViewDefs);
        self::assertNotNull($listViewDefs->getListView());
        self::assertIsArray($listViewDefs->getListView());
        self::assertNotEmpty($listViewDefs->getListView());

        $firstColumn = $listViewDefs->getListView()['columns'][0];
        self::assertIsArray($firstColumn);
        self::assertNotEmpty($firstColumn);

        self::assertArrayHasKey('name', $firstColumn);
        self::assertArrayHasKey('label', $firstColumn);
        self::assertArrayHasKey('link', $firstColumn);
        self::assertIsBool($firstColumn['link']);
        self::assertArrayHasKey('sortable', $firstColumn);
        self::assertIsBool($firstColumn['sortable']);
        self::assertArrayHasKey('fieldDefinition', $firstColumn);
        self::assertIsArray($firstColumn['fieldDefinition']);

        self::assertArrayHasKey('name', $firstColumn['fieldDefinition']);
        self::assertArrayHasKey('type', $firstColumn['fieldDefinition']);
        self::assertArrayHasKey('vname', $firstColumn['fieldDefinition']);

        $actions = $listViewDefs->getListView()['bulkActions'];
        self::assertIsArray($actions);
        self::assertNotEmpty($actions);

        self::assertArrayHasKey('delete', $actions);
        self::assertSame([
            'key' => 'delete',
            'labelKey' => 'LBL_DELETE',
            'params' => [
                'min' => 1,
                'max' => 5
            ],
            'acl' => ['delete']
        ], $actions['delete']);

        self::assertArrayHasKey('export', $actions);
        self::assertSame([
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
        self::assertNotNull($searchDefs);
        self::assertNotNull($searchDefs->getSearch());
        self::assertIsArray($searchDefs->getSearch());
        self::assertNotEmpty($searchDefs->getSearch());
        self::assertArrayHasKey('layout', $searchDefs->getSearch());

        self::assertNotNull($searchDefs->getSearch()['layout']);
        self::assertIsArray($searchDefs->getSearch()['layout']);
        self::assertNotEmpty($searchDefs->getSearch()['layout']);

        self::assertArrayHasKey('basic', $searchDefs->getSearch()['layout']);
        self::assertNotNull($searchDefs->getSearch()['layout']['basic']);
        self::assertIsArray($searchDefs->getSearch()['layout']['basic']);
        self::assertNotEmpty($searchDefs->getSearch()['layout']['basic']);

        $first = array_pop($searchDefs->getSearch()['layout']['basic']);
        self::assertIsArray($first);
        self::assertNotEmpty($first);

        self::assertArrayHasKey('name', $first);

        self::assertArrayHasKey('advanced', $searchDefs->getSearch()['layout']);
        self::assertNotNull($searchDefs->getSearch()['layout']['advanced']);
        self::assertIsArray($searchDefs->getSearch()['layout']['advanced']);
        self::assertNotEmpty($searchDefs->getSearch()['layout']['advanced']);

        $first = array_pop($searchDefs->getSearch()['layout']['advanced']);
        self::assertIsArray($first);
        self::assertNotEmpty($first);

        self::assertArrayHasKey('name', $first);
    }

    /**
     * Test search defs formats for simplified configuration
     * @throws Exception
     */
    public function testSearchDefsFormatForSimpleConfiguration(): void
    {
        $searchDefs = $this->viewDefinitionHandler->getSearchDefs('workflow');
        self::assertNotNull($searchDefs);
        self::assertNotNull($searchDefs->getSearch());
        self::assertIsArray($searchDefs->getSearch());
        self::assertNotEmpty($searchDefs->getSearch());
        self::assertArrayHasKey('layout', $searchDefs->getSearch());

        self::assertNotNull($searchDefs->getSearch()['layout']);
        self::assertIsArray($searchDefs->getSearch()['layout']);
        self::assertNotEmpty($searchDefs->getSearch()['layout']);

        self::assertArrayHasKey('advanced', $searchDefs->getSearch()['layout']);
        self::assertNotNull($searchDefs->getSearch()['layout']['advanced']);
        self::assertIsArray($searchDefs->getSearch()['layout']['advanced']);
        self::assertNotEmpty($searchDefs->getSearch()['layout']['advanced']);

        $first = array_pop($searchDefs->getSearch()['layout']['advanced']);
        self::assertIsArray($first);
        self::assertNotEmpty($first);

        self::assertArrayHasKey('name', $first);
    }

    /**
     * Test record view defs retrieval
     * @throws Exception
     */
    public function testRecordViewDefs(): void
    {
        $recordViewDefs = $this->viewDefinitionHandler->getRecordViewDefs('accounts');

        self::assertNotNull($recordViewDefs);
        self::assertNotNull($recordViewDefs->getRecordView());
        self::assertIsArray($recordViewDefs->getRecordView());
        self::assertNotEmpty($recordViewDefs->getRecordView());
        self::assertArrayHasKey('templateMeta', $recordViewDefs->getRecordView());
        self::assertArrayHasKey('actions', $recordViewDefs->getRecordView());
        self::assertArrayHasKey('panels', $recordViewDefs->getRecordView());

        self::assertNotNull($recordViewDefs->getRecordView()['templateMeta']);
        self::assertIsArray($recordViewDefs->getRecordView()['templateMeta']);
        self::assertNotEmpty($recordViewDefs->getRecordView()['templateMeta']);

        self::assertArrayHasKey('maxColumns', $recordViewDefs->getRecordView()['templateMeta']);
        self::assertArrayHasKey('useTabs', $recordViewDefs->getRecordView()['templateMeta']);
        self::assertArrayHasKey('tabDefs', $recordViewDefs->getRecordView()['templateMeta']);

        self::assertNotNull($recordViewDefs->getRecordView()['panels']);
        self::assertIsArray($recordViewDefs->getRecordView()['panels']);
        self::assertNotEmpty($recordViewDefs->getRecordView()['panels']);

        $panels = $recordViewDefs->getRecordView()['panels'];
        $firstPanel = $panels[0];

        self::assertIsArray($firstPanel);
        self::assertNotEmpty($firstPanel);
        self::assertArrayHasKey('key', $firstPanel);
        self::assertArrayHasKey('key', $firstPanel);
        self::assertNotEmpty($firstPanel['rows']);

        $firstRow = $firstPanel['rows'][0];
        self::assertIsArray($firstRow);
        self::assertNotEmpty($firstRow);
        self::assertArrayHasKey('cols', $firstRow);
        self::assertNotEmpty($firstRow['cols']);

        $firstCol = $firstRow['cols'][0];
        self::assertIsArray($firstCol);
        self::assertNotEmpty($firstCol);
        self::assertArrayHasKey('fieldDefinition', $firstCol);
        self::assertArrayHasKey('name', $firstCol);
        self::assertArrayHasKey('label', $firstCol);
        self::assertNotEmpty($firstCol['fieldDefinition']);
    }

    /**
     * Test subpanel defs retrieval
     * @throws Exception
     */
    public function testSubPanelDefs(): void
    {
        $viewDef = $this->viewDefinitionHandler->getViewDefs('accounts', ['subPanel']);

        self::assertNotNull($viewDef);
        self::assertNotEmpty($viewDef);
        self::assertIsObject($viewDef);

        $subPanels = $viewDef->subpanel;
        self::assertIsArray($subPanels);

        $activities = $subPanels['activities'];

        self::assertIsArray($activities);
        self::assertNotEmpty($activities);
        self::assertArrayHasKey('title_key', $activities);
        self::assertArrayHasKey('module', $activities);
        self::assertArrayHasKey('top_buttons', $activities);
        self::assertNotEmpty($activities['top_buttons']);

        self::assertArrayHasKey('key', $activities['top_buttons'][0]);
        self::assertNotEmpty($activities['top_buttons'][0]['key']);
        self::assertArrayHasKey('labelKey', $activities['top_buttons'][0]);
        self::assertNotEmpty($activities['top_buttons'][0]['labelKey']);

        self::assertArrayHasKey('columns', $activities);
        self::assertNotEmpty($activities['columns']);

        self::assertArrayHasKey('columns', $activities);
        self::assertNotEmpty($activities['columns']);
        self::assertNotEmpty($activities['columns'][0]);
        self::assertArrayHasKey('name', $activities['columns'][0]);
        self::assertArrayHasKey('label', $activities['columns'][0]);
        self::assertArrayHasKey('fieldDefinition', $activities['columns'][0]);
        self::assertArrayHasKey('type', $activities['columns'][0]);
    }
}
