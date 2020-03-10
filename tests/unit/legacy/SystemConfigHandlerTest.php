<?php namespace App\Tests;

use ApiPlatform\Core\Exception\ItemNotFoundException;
use Codeception\Test\Unit;
use SuiteCRM\Core\Legacy\SystemConfigHandler;

class SystemConfigHandlerTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var SystemConfigHandler
     */
    protected $handler;

    protected function _before()
    {
        $exposedSystemConfigs = [
            'default_language' => true,
            'passwordsetting' => [
                'forgotpasswordON' => true
            ],
            'search' => [
                'controller' => true,
                'pagination' => [
                    'min' => true,
                ]
            ],
            'languages' => true,
        ];

        $projectDir = codecept_root_dir();
        $legacyDir = $projectDir . '/legacy';
        $legacySessionName = 'LEGACYSESSID';
        $defaultSessionName = 'PHPSESSID';

        $this->handler = new SystemConfigHandler($projectDir, $legacyDir, $legacySessionName, $defaultSessionName,
            $exposedSystemConfigs);
    }

    protected function _after()
    {
    }

    // tests
    public function testEmptySystemConfigKeyCheck()
    {
        $defaultLanguage = $this->handler->getSystemConfig('');
        static::assertNull($defaultLanguage);
    }

    public function testInvalidExposedSystemConfigCheck()
    {
        $this->expectException(ItemNotFoundException::class);
        $this->handler->getSystemConfig('dbconfig');
    }

    public function testGetValidOneLevelSystemConfig()
    {
        $defaultLanguage = $this->handler->getSystemConfig('default_language');
        static::assertNotNull($defaultLanguage);
        static::assertEquals('default_language', $defaultLanguage->getId());
        static::assertEquals('en_us', $defaultLanguage->getValue());
        static::assertEmpty($defaultLanguage->getItems());
    }

    public function testGetValidTwoLevelSystemConfig()
    {
        $defaultLanguage = $this->handler->getSystemConfig('passwordsetting');
        static::assertNotNull($defaultLanguage);
        static::assertEquals('passwordsetting', $defaultLanguage->getId());
        static::assertNull($defaultLanguage->getValue());
        static::assertIsArray($defaultLanguage->getItems());

        $expected = [
            'forgotpasswordON' => false
        ];

        $this->assertSame(
            $expected,
            $defaultLanguage->getItems()
        );
    }

    public function testGetValidThreeLevelSystemConfig()
    {
        $defaultLanguage = $this->handler->getSystemConfig('search');
        static::assertNotNull($defaultLanguage);
        static::assertEquals('search', $defaultLanguage->getId());
        static::assertNull($defaultLanguage->getValue());
        static::assertIsArray($defaultLanguage->getItems());

        $expected = [
            'controller' => 'UnifiedSearch',
            'pagination' => [
                'min' => 10,
            ]
        ];

        static::assertSame(
            $expected,
            $defaultLanguage->getItems()
        );

    }
}