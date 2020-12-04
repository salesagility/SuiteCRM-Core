<?php

namespace App\Tests\unit\core\legacy\SystemConfig;

use App\Entity\SystemConfig;
use App\Legacy\DateTimeHandler;
use App\Legacy\SystemConfig\TimeFormatConfigMapper;
use App\Tests\UnitTester;
use Codeception\Test\Unit;
use Exception;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Storage\MockArraySessionStorage;

/**
 * Class TimeFormatConfigMapper
 * @package App\Tests\unit\core\legacy\SystemConfig
 */
class TimeFormatConfigMapperTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var TimeFormatConfigMapper
     */
    protected $handler;

    /**
     * Test Get Key
     */
    public function testGetKey(): void
    {
        static::assertEquals('timef', $this->handler->getKey());
    }

    /**
     * Test empty definition
     */
    public function testEmptyConfig(): void
    {
        $config = new SystemConfig();
        $config->setValue(null);
        $this->handler->map($config);
        static::assertNull($config->getValue());
    }

    /**
     * Test mapping existing config
     */
    public function testMapTimeFormat(): void
    {
        $config = new SystemConfig();
        $config->setValue('H-i');
        $this->handler->map($config);
        static::assertEquals('HH-mm', $config->getValue());
    }

    /**
     * @throws Exception
     */
    protected function _before(): void
    {
        $session = new Session(new MockArraySessionStorage('PHPSESSID'));
        $session->start();

        $projectDir = $this->tester->getProjectDir();
        $legacyDir = $this->tester->getLegacyDir();
        $legacySessionName = $this->tester->getLegacySessionName();
        $defaultSessionName = $this->tester->getDefaultSessionName();

        $legacyScope = $this->tester->getLegacyScope();

        $dateTimeHandler = new DateTimeHandler(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope,
            $this->tester->getDatetimeFormatMap(),
            $session
        );

        $this->handler = new TimeFormatConfigMapper($dateTimeHandler);
    }
}
