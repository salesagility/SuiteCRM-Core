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

    protected function _before(): void
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

    // tests

    /**
     * Test empty config key handling in SystemConfigHandler
     */
    public function testEmptySystemConfigKeyCheck(): void
    {
        $defaultLanguage = $this->handler->getSystemConfig('');
        static::assertNull($defaultLanguage);
    }

    /**
     * Test invalid config key handling in SystemConfigHandler
     */
    public function testInvalidExposedSystemConfigCheck(): void
    {
        $this->expectException(ItemNotFoundException::class);
        $this->handler->getSystemConfig('dbconfig');
    }

    /**
     * Test retrieval of first level system config in SystemConfigHandler
     */
    public function testGetValidOneLevelSystemConfig(): void
    {
        $defaultLanguage = $this->handler->getSystemConfig('default_language');
        static::assertNotNull($defaultLanguage);
        static::assertEquals('default_language', $defaultLanguage->getId());
        static::assertEquals('en_us', $defaultLanguage->getValue());
        static::assertEmpty($defaultLanguage->getItems());
    }

    /**
     * Test retrieval of second level deep system config in SystemConfigHandler
     */
    public function testGetValidTwoLevelSystemConfig(): void
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

    /**
     * Test retrieval of third level deep system config in SystemConfigHandler
     */
    public function testGetValidThreeLevelSystemConfig(): void
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