<?php namespace App\Tests;

use Codeception\Test\Unit;
use SuiteCRM\Core\Legacy\ClassicViewRoutingExclusionsHandler;
use SuiteCRM\Core\Legacy\LegacyScopeState;

class ClassicViewRoutingExclusionsHandlerTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var ClassicViewRoutingExclusionsHandler
     */
    protected $handler;

    protected function _before(): void
    {
        $projectDir = codecept_root_dir();
        $legacyDir = $projectDir . '/legacy';
        $legacySessionName = 'LEGACYSESSID';
        $defaultSessionName = 'PHPSESSID';

        $legacyScope = new LegacyScopeState();

        $this->handler = new ClassicViewRoutingExclusionsHandler(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope
        );
    }

    // tests

    /**
     * Test exclusion retrieval
     */
    public function testGetExclusions(): void
    {
        $exclusions = $this->handler->get();

        static::assertNotNull($exclusions);
        static::assertIsArray($exclusions);
        static::assertNotEmpty($exclusions);
        static::assertArrayHasKey('any', $exclusions);

        static::assertNotNull( $exclusions['any']);
        static::assertIsArray( $exclusions['any']);
        static::assertNotEmpty( $exclusions['any']);
    }
}
