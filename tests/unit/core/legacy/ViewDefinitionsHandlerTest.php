<?php

namespace App\Tests;

use App\Entity\ViewDefinition;
use AspectMock\Test;
use Codeception\Test\Unit;
use Exception;
use SuiteCRM\Core\Legacy\ActionNameMapperHandler;
use SuiteCRM\Core\Legacy\ModuleNameMapperHandler;
use SuiteCRM\Core\Legacy\ModuleRegistryHandler;
use SuiteCRM\Core\Legacy\ViewDefinitionsHandler;
use SuiteCRM\Core\Legacy\RouteConverterHandler;

final class ViewDefinitionsHandlerTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var ViewDefinition
     */
    protected $viewDefinition;

    /**
     * @var ViewDefinitionsHandler
     */
    private $viewDefinitionHandler;

    /**
     * @throws Exception
     * @noinspection StaticClosureCanBeUsedInspection
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

        $this->viewDefinitionHandler = new ViewDefinitionsHandler(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope,
            $moduleNameMapper
        );

        $this->viewDefinition = $this->viewDefinitionHandler->getListViewDef('Accounts');
    }
}
