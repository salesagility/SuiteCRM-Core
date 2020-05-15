<?php namespace App\Tests;

use Codeception\Test\Unit;
use SuiteCRM\Core\Legacy\LegacyScopeState;
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
        $projectDir = codecept_root_dir();
        $legacyDir = $projectDir . '/legacy';
        $legacySessionName = 'LEGACYSESSID';
        $defaultSessionName = 'PHPSESSID';

        $legacyScope = new LegacyScopeState();

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