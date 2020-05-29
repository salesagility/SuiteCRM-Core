<?php

namespace App\Tests\Helper;

use Codeception\Module;
use Codeception\TestInterface;
use SuiteCRM\Core\Legacy\LegacyScopeState;

class Unit extends Module
{
    /**
     * @var LegacyScopeState
     */
    public static $legacyScope;

    /**
     * @var string
     */
    public static $projectDir;

    /**
     * @var string
     */
    public static $legacyDir;

    /**
     * @var string
     */
    public static $legacySessionName;

    /**
     * @var string
     */
    public static $defaultSessionName;

    /**
     * @var array
     */
    public static $datetimeFormatMap;

    /**
     * @param array $settings
     */
    public function _beforeSuite($settings = []): void
    {
        self::$projectDir = codecept_root_dir();
        self::$legacyDir = self::$projectDir . '/legacy';
        self::$legacySessionName = 'LEGACYSESSID';
        self::$defaultSessionName = 'PHPSESSID';
        self::$datetimeFormatMap = [
            'A' => 'a',
            'a' => 'aaaaaa',
            'd' => 'dd',
            'H' => 'HH',
            'h' => 'hh',
            'i' => 'mm',
            'M' => 'MMM',
            'm' => 'MM',
            'Y' => 'yyyy'
        ];
    }

    /**
     * @param TestInterface $test
     */
    public function _before(TestInterface $test): void
    {
        self::$legacyScope = new LegacyScopeState();
    }
}
