<?php

namespace App\Tests\unit\core\legacy;

use ApiPlatform\Core\Exception\ItemNotFoundException;
use App\Languages\Entity\ModStrings;
use App\Tests\UnitTester;
use Codeception\Test\Unit;
use App\Languages\LegacyHandler\ModStringsHandler;
use App\Module\LegacyHandler\ModuleNameMapperHandler;
use App\Module\LegacyHandler\ModuleRegistryHandler;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Storage\MockArraySessionStorage;

/**
 * Class ModStringsHandlerTest
 * @package App\Tests\unit\core\legacy
 */
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
            $excludedModules,
            $session
        );


        $this->handler = new ModStringsHandler(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope,
            $moduleNameMapper,
            $moduleRegistry,
            $session
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
