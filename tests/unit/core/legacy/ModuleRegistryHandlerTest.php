<?php

namespace App\Tests\unit\core\legacy;

use App\Tests\UnitTester;
use Codeception\Test\Unit;
use App\Legacy\ModuleRegistryHandler;

/**
 * Class ModuleRegistryHandlerTest
 * @package App\Tests\unit\core\legacy
 */
class ModuleRegistryHandlerTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var ModuleRegistryHandler
     */
    protected $handler;

    protected function _before(): void
    {
        $projectDir = $this->tester->getProjectDir();
        $legacyDir = $this->tester->getLegacyDir();
        $legacySessionName = $this->tester->getLegacySessionName();
        $defaultSessionName = $this->tester->getDefaultSessionName();
        $legacyScope = $this->tester->getLegacyScope();

        $excludedModules = [
            'EmailText',
            'TeamMemberships',
            'TeamSets',
            'TeamSetModule'
        ];

        $this->handler = new ModuleRegistryHandler(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope,
            $excludedModules
        );
    }

    // tests

    /**
     * Test accessible modules retrieval
     */
    public function testGetAccessibleModules(): void
    {

        $modules = $this->handler->getUserAccessibleModules();

        static::assertContainsEquals('Accounts', $modules);
        static::assertContainsEquals('Alert', $modules);
        static::assertContainsEquals('EmailMan', $modules);
    }
}
