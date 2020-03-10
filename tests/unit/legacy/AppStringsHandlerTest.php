<?php namespace App\Tests;

use ApiPlatform\Core\Exception\ItemNotFoundException;
use App\Entity\AppStrings;
use Codeception\Test\Unit;
use SuiteCRM\Core\Legacy\AppStringsHandler;

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

    protected function _before()
    {
        $projectDir = codecept_root_dir();
        $legacyDir = $projectDir . '/legacy';
        $legacySessionName = 'LEGACYSESSID';
        $defaultSessionName = 'PHPSESSID';
        $this->handler = new AppStringsHandler($projectDir, $legacyDir, $legacySessionName, $defaultSessionName);
    }

    protected function _after()
    {
    }

    // tests
    public function testInvalidLanguageCheck()
    {
        $this->expectException(ItemNotFoundException::class);
        $this->handler->getAppStrings('invalid_lang');
    }

    public function testDefaultLanguageKey()
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
    protected function assertLanguageKey($key, AppStrings $appStrings)
    {
        static::assertArrayHasKey($key, $appStrings->getItems());
        static::assertNotEmpty($appStrings->getItems()[$key]);
    }

}