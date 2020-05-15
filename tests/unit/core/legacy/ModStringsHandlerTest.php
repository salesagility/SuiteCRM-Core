<?php namespace App\Tests;

use ApiPlatform\Core\Exception\ItemNotFoundException;
use App\Entity\ModStrings;
use Codeception\Test\Unit;
use SuiteCRM\Core\Legacy\LegacyScopeState;
use SuiteCRM\Core\Legacy\ModStringsHandler;
use SuiteCRM\Core\Legacy\ModuleNameMapperHandler;
use SuiteCRM\Core\Legacy\ModuleRegistryHandler;

class ModStringsHandlerTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var ModStringsHandler
     */
    protected $handler;

    protected function _before(): void
    {
        $projectDir = codecept_root_dir();
        $legacyDir = $projectDir . '/legacy';
        $legacySessionName = 'LEGACYSESSID';
        $defaultSessionName = 'PHPSESSID';

        $legacyScope = new LegacyScopeState();

        $moduleNameMapper = new ModuleNameMapperHandler(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope
        );

        $excludedModules = [
            'EmailText',
            'TeamMemberships',
            'TeamSets',
            'TeamSetModule'
        ];

        $moduleRegistry = new ModuleRegistryHandler(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope,
            $excludedModules
        );


        $this->handler = new ModStringsHandler(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope,
            $moduleNameMapper,
            $moduleRegistry
        );
    }

    // tests

    /**
     * Test Invalid language handling in ModStringsHandler
     */
    public function testInvalidLanguageCheck(): void
    {
        $this->expectException(ItemNotFoundException::class);
        $this->handler->getModStrings('invalid_lang');
    }

    /**
     * Test default language retrieval in ModStringsHandler
     */
    public function testDefaultLanguageKey(): void
    {
        $modStrings = $this->handler->getModStrings('en_us');
        static::assertNotNull($modStrings);
        static::assertEquals('en_us', $modStrings->getId());
        static::assertIsArray($modStrings->getItems());
        $this->assertLanguageKey('home', 'LBL_MODULE_NAME', $modStrings);
        $this->assertLanguageKey('accounts', 'LNK_ACCOUNT_LIST', $modStrings);
        $this->assertLanguageKey('accounts', 'LNK_NEW_ACCOUNT', $modStrings);
    }

    /**
     * Asserts that the given label $key exists in Mod
     * @param $module
     * @param string $key
     * @param ModStrings $modStrings
     */
    protected function assertLanguageKey($module, $key, ModStrings $modStrings): void
    {
        static::assertArrayHasKey($module, $modStrings->getItems());
        static::assertNotEmpty($modStrings->getItems()[$module]);
        static::assertIsArray($modStrings->getItems()[$module]);
        static::assertArrayHasKey($key, $modStrings->getItems()[$module]);
        static::assertNotEmpty($modStrings->getItems()[$module][$key]);
    }

}