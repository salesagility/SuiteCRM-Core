<?php namespace App\Tests;

use ApiPlatform\Core\Exception\ItemNotFoundException;
use AspectMock\Test;
use Codeception\Test\Unit;
use Exception;
use SuiteCRM\Core\Legacy\UserPreferenceHandler;
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
     */
    protected function _before(): void
    {
        $exposedUserPreferences = [
            'global' => [
                'timezone' => true
            ]
        ];

        $mockPreferences = [
            'global' => [
                'timezone' => 'UTC'
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

        $projectDir = codecept_root_dir();
        $legacyDir = $projectDir . '/legacy';
        $legacySessionName = 'LEGACYSESSID';
        $defaultSessionName = 'PHPSESSID';

        $this->handler = new UserPreferenceHandler($projectDir, $legacyDir, $legacySessionName, $defaultSessionName,
            $exposedUserPreferences);
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
}