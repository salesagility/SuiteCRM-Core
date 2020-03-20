<?php namespace App\Tests;

use ApiPlatform\Core\Exception\ItemNotFoundException;
use App\Entity\ModStrings;
use Codeception\Test\Unit;
use SuiteCRM\Core\Legacy\ModStringsHandler;

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

    protected function _before()
    {
        $projectDir = codecept_root_dir();
        $legacyDir = $projectDir . '/legacy';
        $legacySessionName = 'LEGACYSESSID';
        $defaultSessionName = 'PHPSESSID';
        $this->handler = new ModStringsHandler($projectDir, $legacyDir, $legacySessionName, $defaultSessionName);
    }

    // tests

    /**
     * Test Invalid language handling in ModStringsHandler
     */
    public function testInvalidLanguageCheck()
    {
        $this->expectException(ItemNotFoundException::class);
        $this->handler->getModStrings('invalid_lang');
    }

    /**
     * Test default language retrieval in ModStringsHandler
     */
    public function testDefaultLanguageKey()
    {
        $modStrings = $this->handler->getModStrings('en_us');
        static::assertNotNull($modStrings);
        static::assertEquals('en_us', $modStrings->getId());
        static::assertIsArray($modStrings->getItems());
        $this->assertLanguageKey('Home', 'LBL_MODULE_NAME', $modStrings);
        $this->assertLanguageKey('Accounts', 'LNK_ACCOUNT_LIST', $modStrings);
        $this->assertLanguageKey('Accounts', 'LNK_NEW_ACCOUNT', $modStrings);
    }

    /**
     * Asserts that the given label $key exists in Mod
     * @param $module
     * @param string $key
     * @param ModStrings $modStrings
     */
    protected function assertLanguageKey($module, $key, ModStrings $modStrings)
    {
        static::assertArrayHasKey($module, $modStrings->getItems());
        static::assertNotEmpty($modStrings->getItems()[$module]);
        static::assertIsArray($modStrings->getItems()[$module]);
        static::assertArrayHasKey($key, $modStrings->getItems()[$module]);
        static::assertNotEmpty($modStrings->getItems()[$module][$key]);
    }

}