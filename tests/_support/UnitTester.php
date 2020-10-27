<?php

namespace App\Tests;

use App\Tests\Helper\Unit as Tester;
use Codeception\Actor;
use Codeception\Lib\Friend;
use App\Legacy\LegacyScopeState;

/**
 * Inherited Methods
 * @method void wantToTest($text)
 * @method void wantTo($text)
 * @method void execute($callable)
 * @method void expectTo($prediction)
 * @method void expect($prediction)
 * @method void amGoingTo($argumentation)
 * @method void am($role)
 * @method void lookForwardTo($achieveValue)
 * @method void comment($description)
 * @method Friend haveFriend($name, $actorClass = null)
 *
 * @SuppressWarnings(PHPMD)
 */
class UnitTester extends Actor
{
    /**
     * @return LegacyScopeState
     */
    public function getLegacyScope(): LegacyScopeState
    {
        return Tester::$legacyScope;
    }

    /**
     * @return string
     */
    public function getProjectDir(): string
    {
        return Tester::$projectDir;
    }

    /**
     * @return string
     */
    public function getLegacyDir(): string
    {
        return Tester::$legacyDir;
    }

    /**
     * @return string
     */
    public function getLegacySessionName(): string
    {
        return Tester::$legacySessionName;
    }

    /**
     * @return string
     */
    public function getDefaultSessionName(): string
    {
        return Tester::$defaultSessionName;
    }

    /**
     * @return array
     */
    public function getDatetimeFormatMap(): array
    {
        return Tester::$datetimeFormatMap;
    }
}
