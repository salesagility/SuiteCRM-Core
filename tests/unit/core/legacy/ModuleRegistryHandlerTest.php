<?php namespace App\Tests;

use Codeception\Test\Unit;
use SuiteCRM\Core\Legacy\ModuleRegistryHandler;

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
        $legacySessionName = $this->tester->getlegacySessionName();
        $defaultSessionName = $this->tester->getdefaultSessionName();
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
