<?php namespace App\Tests;

use Codeception\Test\Unit;
use App\Legacy\ClassicViewRoutingExclusionsHandler;

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
        $projectDir = $this->tester->getProjectDir();
        $legacyDir = $this->tester->getLegacyDir();
        $legacySessionName = $this->tester->getLegacySessionName();
        $defaultSessionName = $this->tester->getDefaultSessionName();
        $legacyScope = $this->tester->getLegacyScope();

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

        static::assertNotNull($exclusions['any']);
        static::assertIsArray($exclusions['any']);
        static::assertNotEmpty($exclusions['any']);
    }
}
