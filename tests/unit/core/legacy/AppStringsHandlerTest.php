<?php

namespace App\Tests\unit\core\legacy;

use ApiPlatform\Core\Exception\ItemNotFoundException;
use App\Entity\AppStrings;
use App\Tests\UnitTester;
use Codeception\Test\Unit;
use App\Legacy\AppStringsHandler;

/**
 * Class AppStringsHandlerTest
 * @package App\Tests\unit\core\legacy
 */
class AppStringsHandlerTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var AppStringsHandler
     */
    protected $handler;

    protected function _before(): void
    {
        $this->handler = new AppStringsHandler(
            $this->tester->getProjectDir(),
            $this->tester->getLegacyDir(),
            $this->tester->getLegacySessionName(),
            $this->tester->getDefaultSessionName(),
            $this->tester->getLegacyScope()
        );
    }

    // tests

    /**
     * Test Invalid language handling in AppStringsHandler
     */
    public function testInvalidLanguageCheck(): void
    {
        $this->expectException(ItemNotFoundException::class);
        $this->handler->getAppStrings('invalid_lang');
    }

    /**
     * Test default language retrieval in AppStringsHandler
     */
    public function testDefaultLanguageKey(): void
    {
        $appStrings = $this->handler->getAppStrings('en_us');
        static::assertNotNull($appStrings);
        static::assertEquals('en_us', $appStrings->getId());
        static::assertIsArray($appStrings->getItems());
        $this->assertLanguageKey('LBL_LOGOUT', $appStrings);
        $this->assertLanguageKey('LBL_LOGIN_BUTTON_LABEL', $appStrings);
        $this->assertLanguageKey('LBL_LOGIN_BUTTON_TITLE', $appStrings);
        $this->assertLanguageKey('LBL_LOGIN_FORGOT_PASSWORD', $appStrings);
        $this->assertLanguageKey('LBL_LOGIN_SUBMIT', $appStrings);
        $this->assertLanguageKey('LBL_USER_NAME', $appStrings);
        $this->assertLanguageKey('LBL_USER_NAME', $appStrings);
        $this->assertLanguageKey('ERR_INVALID_PASSWORD', $appStrings);
        $this->assertLanguageKey('LBL_PASSWORD', $appStrings);
    }

    /**
     * Asserts that the given label $key exists in appStrings
     * @param string $key
     * @param AppStrings $appStrings
     */
    protected function assertLanguageKey($key, AppStrings $appStrings): void
    {
        static::assertArrayHasKey($key, $appStrings->getItems());
        static::assertNotEmpty($appStrings->getItems()[$key]);
    }

}
