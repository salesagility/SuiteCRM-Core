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
    static public $legacyScope;

    /**
     * @var string
     */
    static public $projectDir;

    /**
     * @var string
     */
    static public $legacyDir;

    /**
     * @var string
     */
    static public $legacySessionName;

    /**
     * @var string
     */
    static public $defaultSessionName;

    public function _beforeSuite($settings = []): void
    {
        self::$projectDir = codecept_root_dir();
        self::$legacyDir = self::$projectDir . '/legacy';
        self::$legacySessionName = 'LEGACYSESSID';
        self::$defaultSessionName = 'PHPSESSID';
    }

    /**
     * @param TestInterface $test
     */
    public function _before(TestInterface $test): void
    {
        self::$legacyScope = new legacyScopeState;
    }
}
