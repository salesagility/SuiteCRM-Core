<?php namespace App\Tests;

use ApiPlatform\Core\Exception\ItemNotFoundException;
use App\Service\ActionNameMapper;
use App\Service\ModuleNameMapper;
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
            'module_name_map' => true,
            'action_name_map' => true
        ];

        $projectDir = codecept_root_dir();
        $legacyDir = $projectDir . '/legacy';
        $legacySessionName = 'LEGACYSESSID';
        $defaultSessionName = 'PHPSESSID';

        $legacyModuleNameMap = [
            'Contacts' => [
                'frontend' => 'contacts',
                'core' => 'Contacts'
            ],
        ];

        $legacyActionNameMap = [
            'index ' => 'index',
            'DetailView' => 'record',
            'EditView' => 'edit',
            'ListView' => 'list',
        ];

        $moduleMapper = new ModuleNameMapper($legacyModuleNameMap);
        $actionMapper = new ActionNameMapper($legacyActionNameMap);

        $this->handler = new SystemConfigHandler($projectDir, $legacyDir, $legacySessionName, $defaultSessionName,
            $exposedSystemConfigs, $actionMapper, $moduleMapper);
    }

    // tests

    /**
     * Test empty config key handling in SystemConfigHandler
     */
    public function testEmptySystemConfigKeyCheck(): void
    {
        $emptyConfig = $this->handler->getSystemConfig('');
        static::assertNull($emptyConfig);
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
        $passwordSetting = $this->handler->getSystemConfig('passwordsetting');
        static::assertNotNull($passwordSetting);
        static::assertEquals('passwordsetting', $passwordSetting->getId());
        static::assertNull($passwordSetting->getValue());
        static::assertIsArray($passwordSetting->getItems());

        static::assertArrayHasKey('forgotpasswordON', $passwordSetting->getItems());
        static::assertIsNotArray($passwordSetting->getItems()['forgotpasswordON']);
    }

    /**
     * Test retrieval of third level deep system config in SystemConfigHandler
     */
    public function testGetValidThreeLevelSystemConfig(): void
    {
        $searchConfig = $this->handler->getSystemConfig('search');
        static::assertNotNull($searchConfig);
        static::assertEquals('search', $searchConfig->getId());
        static::assertNull($searchConfig->getValue());
        static::assertIsArray($searchConfig->getItems());

        static::assertArrayHasKey('controller', $searchConfig->getItems());
        static::assertArrayHasKey('pagination', $searchConfig->getItems());
        static::assertIsArray($searchConfig->getItems()['pagination']);
        static::assertArrayHasKey('min', $searchConfig->getItems()['pagination']);
    }

    /**
     * Test injected module name map config
     */
    public function testInjectedModuleNameMapConfig(): void
    {
        $moduleNameMap = $this->handler->getSystemConfig('module_name_map');
        static::assertNotNull($moduleNameMap);
        static::assertEquals('module_name_map', $moduleNameMap->getId());
        static::assertNull($moduleNameMap->getValue());
        static::assertIsArray($moduleNameMap->getItems());

        static::assertArrayHasKey('Contacts', $moduleNameMap->getItems());
    }

    /**
     * Test injected action name map config
     */
    public function testInjectedActionNameMapConfig(): void
    {
        $actionNameMap = $this->handler->getSystemConfig('action_name_map');
        static::assertNotNull($actionNameMap);
        static::assertEquals('action_name_map', $actionNameMap->getId());
        static::assertNull($actionNameMap->getValue());
        static::assertIsArray($actionNameMap->getItems());

        static::assertArrayHasKey('DetailView', $actionNameMap->getItems());
    }

}