<?php

namespace App\Tests\unit\core\legacy;

use ApiPlatform\Core\Exception\ItemNotFoundException;
use App\Entity\AppListStrings;
use App\Tests\UnitTester;
use Codeception\Test\Unit;
use App\Legacy\AppListStringsHandler;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Storage\MockArraySessionStorage;

/**
 * Class AppListStringsHandlerTest
 * @package App\Tests\unit\core\legacy
 */
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

    protected function _before(): void
    {
        $session = new Session(new MockArraySessionStorage('PHPSESSID'));
        $session->start();

        $this->handler = new AppListStringsHandler(
            $this->tester->getProjectDir(),
            $this->tester->getLegacyDir(),
            $this->tester->getLegacySessionName(),
            $this->tester->getDefaultSessionName(),
            $this->tester->getLegacyScope(),
            $session
        );
    }

    // tests

    /**
     * Test Invalid language handling in AppListStringsHandler
     */
    public function testInvalidLanguageCheck(): void
    {
        $this->expectException(ItemNotFoundException::class);
        $this->handler->getAppListStrings('invalid_lang');
    }

    /**
     * Test default language retrieval in AppListStringsHandler
     */
    public function testDefaultLanguageKey(): void
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
    protected function assertLanguageListKey(string $listKey, string $labelKey, AppListStrings $appStrings): void
    {
        static::assertArrayHasKey($listKey, $appStrings->getItems());
        static::assertNotEmpty($appStrings->getItems()[$listKey]);
        static::assertIsArray($appStrings->getItems()[$listKey]);
        static::assertNotEmpty($appStrings->getItems()[$listKey][$labelKey]);
    }
}
