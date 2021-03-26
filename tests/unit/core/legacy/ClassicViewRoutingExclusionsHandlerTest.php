<?php

namespace App\Tests\unit\core\legacy;

use App\Routes\LegacyHandler\ClassicViewRoutingExclusionsHandler;
use App\Tests\UnitTester;
use Codeception\Test\Unit;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Storage\MockArraySessionStorage;

/**
 * Class ClassicViewRoutingExclusionsHandlerTest
 * @package App\Tests\unit\core\legacy
 */
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
        $session = new Session(new MockArraySessionStorage('PHPSESSID'));
        $session->start();

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
            $legacyScope,
            $session
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
