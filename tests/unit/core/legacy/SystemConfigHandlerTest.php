<?php

namespace App\Tests;

use ApiPlatform\Core\Exception\ItemNotFoundException;
use Codeception\Test\Unit;
use Exception;
use SuiteCRM\Core\Legacy\ActionNameMapperHandler;
use SuiteCRM\Core\Legacy\ClassicViewRoutingExclusionsHandler;
use SuiteCRM\Core\Legacy\CurrencyHandler;
use SuiteCRM\Core\Legacy\DateTimeHandler;
use SuiteCRM\Core\Legacy\ModuleNameMapperHandler;
use SuiteCRM\Core\Legacy\SystemConfig\DateFormatConfigMapper;
use SuiteCRM\Core\Legacy\SystemConfig\DefaultCurrencyConfigMapper;
use SuiteCRM\Core\Legacy\SystemConfig\SystemConfigMappers;
use SuiteCRM\Core\Legacy\SystemConfig\TimeFormatConfigMapper;
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

    /**
     * @throws Exception
     */
    protected function _before(): void
    {
        $projectDir = $this->tester->getProjectDir();
        $legacyDir = $this->tester->getLegacyDir();
        $legacySessionName = $this->tester->getLegacySessionName();
        $defaultSessionName = $this->tester->getDefaultSessionName();
        $legacyScope = $this->tester->getLegacyScope();

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
            'action_name_map' => true,
            'datef' => true,
            'timef' => true,
            'currency' => true,
            'cache_reset_actions' => true
        ];

        $moduleMapper = new ModuleNameMapperHandler(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope
        );

        $actionMapper = new ActionNameMapperHandler(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope
        );

        $classicViewExclusionHandler = new ClassicViewRoutingExclusionsHandler(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope
        );

        $dateTimeHandler = new DateTimeHandler(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope,
            $this->tester->getDatetimeFormatMap()
        );

        $currencyHandler = new CurrencyHandler(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope
        );

        $mappersArray = [
            'datef' => new DateFormatConfigMapper($dateTimeHandler),
            'timef' => new TimeFormatConfigMapper($dateTimeHandler),
            'currency' => new DefaultCurrencyConfigMapper($currencyHandler)
        ];

        /** @var SystemConfigMappers $mappers */
        $mappers = $this->make(
            SystemConfigMappers::class,
            [
                'get' => static function (string $key) use ($mappersArray) {
                    return $mappersArray[$key] ?? null;
                },
                'hasMapper' => static function (string $key) use ($mappersArray) {
                    if (isset($mappersArray[$key])) {
                        return true;
                    }

                    return false;
                },
            ]
        );
        $systemConfigKeyMap = [
            'datef' => 'date_format',
            'timef' => 'time_format'
        ];

        global $sugar_config;
        $sugar_config['datef'] = 'm/d/Y';
        $sugar_config['timef'] = 'H:i';

        $cacheResetActions = [
            'users' => [
                'edit'
            ]
        ];

        $navigationTabLimits = [
            'XSmall' => 4,
            'Small' => 4,
            'Medium' => 6,
            'Large' => 10,
            'XLarge' => 12
        ];

        $listViewColumnLimits = [
            'without_sidebar' => [
                'XSmall' => 4,
                'Small' => 4,
                'Medium' => 6,
                'Large' => 10,
                'XLarge' => 12
            ],
            'with_sidebar' => [
                'XSmall' => 4,
                'Small' => 4,
                'Medium' => 6,
                'Large' => 10,
                'XLarge' => 12
            ]
        ];

        $listViewSettingsLimits = [
            'XSmall' => 1,
            'Small' => 2,
            'Medium' => 3,
            'Large' => 3,
            'XLarge' => 4
        ];

        $listViewActionsLimits = [
            'XSmall' => 1,
            'Small' => 2,
            'Medium' => 5,
            'Large' => 5,
            'XLarge' => 14
        ];

        $this->handler = new SystemConfigHandler(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope,
            $exposedSystemConfigs,
            $actionMapper,
            $moduleMapper,
            $classicViewExclusionHandler,
            $mappers,
            $systemConfigKeyMap,
            $cacheResetActions,
            $navigationTabLimits,
            $listViewColumnLimits,
            $listViewSettingsLimits,
            $listViewActionsLimits
        );
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

    /**
     * Test date format config transformation
     */
    public function testDateFormatMapping(): void
    {
        $format = $this->handler->getSystemConfig('datef');
        static::assertNotNull($format);
        static::assertEquals('date_format', $format->getId());
        static::assertNotNull($format->getValue());
        static::assertIsArray($format->getItems());
        static::assertEmpty($format->getItems());

        static::assertEquals('MM/dd/yyyy', $format->getValue());
    }

    /**
     * Test time format config transformation
     */
    public function testTimeFormatMapping(): void
    {
        $format = $this->handler->getSystemConfig('timef');
        static::assertNotNull($format);
        static::assertEquals('time_format', $format->getId());
        static::assertNotNull($format->getValue());
        static::assertIsArray($format->getItems());
        static::assertEmpty($format->getItems());

        static::assertEquals('HH:mm', $format->getValue());
    }

    /**
     * Test default currency mapping
     */
    public function testDefaultCurrencyMapping(): void
    {
        $currencyConfig = $this->handler->getSystemConfig('currency');
        static::assertNotNull($currencyConfig);
        static::assertEquals('currency', $currencyConfig->getId());
        static::assertNull($currencyConfig->getValue());
        static::assertIsArray($currencyConfig->getItems());
        static::assertNotEmpty($currencyConfig->getItems());

        $currency = $currencyConfig->getItems();
        static::assertNotNull($currency);
        static::assertNotEmpty($currency);

        static::assertArrayHasKey('id', $currency);
        static::assertNotEmpty($currency['id']);
        static::assertEquals($currency['id'], -99);
        static::assertArrayHasKey('name', $currency);
        static::assertNotEmpty($currency['name']);
        static::assertArrayHasKey('symbol', $currency);
        static::assertNotEmpty($currency['symbol']);
        static::assertArrayHasKey('iso4217', $currency);
        static::assertNotEmpty($currency['iso4217']);
    }

    /**
     * Test cache reset actions
     */
    public function testCacheResetActionsConfig(): void
    {
        $cacheClearActionsConfig = $this->handler->getSystemConfig('cache_reset_actions');
        static::assertNotNull($cacheClearActionsConfig);
        static::assertEquals('cache_reset_actions', $cacheClearActionsConfig->getId());
        static::assertNull($cacheClearActionsConfig->getValue());
        static::assertIsArray($cacheClearActionsConfig->getItems());
        static::assertNotEmpty($cacheClearActionsConfig->getItems());

        $cacheClearActions = $cacheClearActionsConfig->getItems();
        static::assertNotNull($cacheClearActions);
        static::assertNotEmpty($cacheClearActions);

        static::assertArrayHasKey('users', $cacheClearActions);
        static::assertNotEmpty($cacheClearActions['users']);
        static::assertContains('edit', $cacheClearActions['users']);
    }
}
