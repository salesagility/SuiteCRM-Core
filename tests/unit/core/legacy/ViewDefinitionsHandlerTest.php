<?php

namespace App\Tests;

use Codeception\Test\Unit;
use Exception;
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

        $this->viewDefinitionHandler = new ViewDefinitionsHandler(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope,
            $moduleNameMapper,
            $fieldDefinitionsHandler
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

        $first = $listViewDefs->getListView()[0];
        static::assertIsArray($first);
        static::assertNotEmpty($first);

        static::assertArrayHasKey('fieldName', $first);
        static::assertArrayHasKey('label', $first);
        static::assertArrayHasKey('link', $first);
        static::assertIsBool($first['link']);
        static::assertArrayHasKey('default', $first);
        static::assertIsBool($first['default']);
        static::assertArrayHasKey('sortable', $first);
        static::assertIsBool($first['sortable']);
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
