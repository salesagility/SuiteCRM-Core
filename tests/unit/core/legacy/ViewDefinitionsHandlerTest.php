<?php

namespace App\Tests;

use App\Service\AclManagerInterface;
use App\Service\BulkActionDefinitionProvider;
use Codeception\Test\Unit;
use Exception;
use SuiteCRM\Core\Legacy\AclHandler;
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

        $this->viewDefinitionHandler = new ViewDefinitionsHandler(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope,
            $moduleNameMapper,
            $fieldDefinitionsHandler,
            $bulkActionProvider
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

        static::assertArrayHasKey('fieldName', $firstColumn);
        static::assertArrayHasKey('label', $firstColumn);
        static::assertArrayHasKey('link', $firstColumn);
        static::assertIsBool($firstColumn['link']);
        static::assertArrayHasKey('default', $firstColumn);
        static::assertIsBool($firstColumn['default']);
        static::assertArrayHasKey('sortable', $firstColumn);
        static::assertIsBool($firstColumn['sortable']);

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

}
