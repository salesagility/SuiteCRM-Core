<?php

namespace App\Tests;

use ApiPlatform\Core\Exception\ItemNotFoundException;
use AspectMock\Test;
use Codeception\Test\Unit;
use Exception;
use SuiteCRM\Core\Legacy\DateTimeHandler;
use SuiteCRM\Core\Legacy\UserPreferenceHandler;
use SuiteCRM\Core\Legacy\UserPreferences\DateFormatPreferenceMapper;
use SuiteCRM\Core\Legacy\UserPreferences\TimeFormatPreferenceMapper;
use SuiteCRM\Core\Legacy\UserPreferences\UserPreferencesMappers;
use User;

class UserPreferencesHandlerTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var UserPreferenceHandler
     */
    protected $handler;

    /**
     * @throws Exception
     * @noinspection StaticClosureCanBeUsedInspection
     */
    protected function _before(): void
    {
        $projectDir = $this->tester->getProjectDir();
        $legacyDir = $this->tester->getLegacyDir();
        $legacySessionName = $this->tester->getLegacySessionName();
        $defaultSessionName = $this->tester->getDefaultSessionName();
        $legacyScope = $this->tester->getLegacyScope();

        $exposedUserPreferences = [
            'global' => [
                'timezone' => true,
                'datef' => true,
                'timef' => true
            ]
        ];

        $mockPreferences = [
            'global' => [
                'timezone' => 'UTC',
                'datef' => 'm/d/Y',
                'timef' => 'H:i'
            ]
        ];

        $self = $this;

        test::double(UserPreferenceHandler::class, [
            'getCurrentUser' => function () use ($self, $mockPreferences) {

                return $self->make(
                    User::class,
                    [
                        'id' => '123',
                        'getPreference' => function ($name, $category = 'global') use ($self, $mockPreferences) {
                            return $mockPreferences[$category][$name];
                        },
                    ]
                );
            },
            'init' => function () {
            },
            'startLegacyApp' => function () {
            },
            'close' => function () {
            }
        ]);

        $dateTimeHandler = new DateTimeHandler(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope,
            $this->tester->getDatetimeFormatMap()
        );

        $mappersArray = [
            'datef' => new DateFormatPreferenceMapper($dateTimeHandler),
            'timef' => new TimeFormatPreferenceMapper($dateTimeHandler)
        ];

        /** @var UserPreferencesMappers $mappers */
        $mappers = $this->make(
            UserPreferencesMappers::class,
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

        $this->handler = new UserPreferenceHandler(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope,
            $exposedUserPreferences,
            $mappers,
            $systemConfigKeyMap
        );
    }

    // tests

    /**
     * Test empty config key handling in UserPreferenceHandler
     */
    public function testEmptyUserPreferenceKeyCheck(): void
    {
        $noKeyUserPreference = $this->handler->getUserPreference('');
        static::assertNull($noKeyUserPreference);
    }

    /**
     * Test invalid config key handling in UserPreferenceHandler
     */
    public function testInvalidExposedUserPreferenceCheck(): void
    {
        $this->expectException(ItemNotFoundException::class);
        $this->handler->getUserPreference('dbconfig');
    }

    /**
     * Test retrieval of first level user preference config in UserPreferenceHandler
     */
    public function testGetUserPreferenceTimezone(): void
    {
        $userPref = $this->handler->getUserPreference('global');

        static::assertNotNull($userPref);
        static::assertEquals('global', $userPref->getId());

        $userPreferences = $userPref->getItems();

        static::assertEquals('UTC', $userPreferences['timezone']);
    }

    /**
     * Test date format preference transformation
     */
    public function testDateFormatMapping(): void
    {
        $userPref = $this->handler->getUserPreference('global');

        static::assertNotNull($userPref);
        static::assertEquals('global', $userPref->getId());

        $userPreferences = $userPref->getItems();

        static::assertArrayHasKey('date_format', $userPreferences);
        $format = $userPreferences['date_format'];
        static::assertNotNull($format);
        static::assertEquals('MM/dd/yyyy', $format);
    }

    /**
     * Test time format preference transformation
     */
    public function testTimeFormatMapping(): void
    {
        $userPref = $this->handler->getUserPreference('global');

        static::assertNotNull($userPref);
        static::assertEquals('global', $userPref->getId());

        $userPreferences = $userPref->getItems();

        static::assertArrayHasKey('time_format', $userPreferences);
        $format = $userPreferences['time_format'];

        static::assertNotNull($format);
        static::assertEquals('HH:mm', $format);
    }
}
