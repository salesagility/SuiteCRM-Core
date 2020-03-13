<?php namespace App\Tests;

use ApiPlatform\Core\Exception\ItemNotFoundException;
use App\Entity\AppListStrings;
use Codeception\Test\Unit;
use SuiteCRM\Core\Legacy\AppListStringsHandler;

class AppListStringsHandlerTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var AppListStringsHandler
     */
    protected $handler;

    protected function _before()
    {
        $projectDir = codecept_root_dir();
        $legacyDir = $projectDir . '/legacy';
        $legacySessionName = 'LEGACYSESSID';
        $defaultSessionName = 'PHPSESSID';
        $this->handler = new AppListStringsHandler($projectDir, $legacyDir, $legacySessionName, $defaultSessionName);
    }

    // tests

    /**
     * Test Invalid language handling in AppListStringsHandler
     */
    public function testInvalidLanguageCheck()
    {
        $this->expectException(ItemNotFoundException::class);
        $this->handler->getAppListStrings('invalid_lang');
    }

    /**
     * Test default language retrieval in AppListStringsHandler
     */
    public function testDefaultLanguageKey()
    {
        $appListStrings = $this->handler->getAppListStrings('en_us');
        static::assertNotNull($appListStrings);
        static::assertEquals('en_us', $appListStrings->getId());
        static::assertIsArray($appListStrings->getItems());
        $this->assertLanguageListKey('moduleListSingular', 'Home', $appListStrings);
        $this->assertLanguageListKey('moduleList', 'Home', $appListStrings);
    }

    /**
     * Asserts that the given label $labelKey exists within the given list with $listKey in appListStrings
     * @param string $listKey
     * @param string $labelKey
     * @param AppListStrings $appStrings
     */
    protected function assertLanguageListKey(string $listKey, string $labelKey, AppListStrings $appStrings)
    {
        static::assertArrayHasKey($listKey, $appStrings->getItems());
        static::assertNotEmpty($appStrings->getItems()[$listKey]);
        static::assertIsArray($appStrings->getItems()[$listKey]);
        static::assertNotEmpty($appStrings->getItems()[$listKey][$labelKey]);
    }

}