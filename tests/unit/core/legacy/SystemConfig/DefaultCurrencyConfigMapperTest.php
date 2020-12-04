<?php

namespace App\Tests\unit\core\legacy\SystemConfig;

use App\Entity\SystemConfig;
use App\Legacy\CurrencyHandler;
use App\Legacy\SystemConfig\DefaultCurrencyConfigMapper;
use App\Tests\UnitTester;
use Codeception\Test\Unit;
use Exception;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Storage\MockArraySessionStorage;

/**
 * Class DefaultCurrencyConfigMapper
 * @package App\Tests\unit\core\legacy\SystemConfig
 */
class DefaultCurrencyConfigMapperTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var DefaultCurrencyConfigMapper
     */
    protected $handler;

    /**
     * Test Get Key
     */
    public function testGetKey(): void
    {
        static::assertEquals('currency', $this->handler->getKey());
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
    public function testMapDefaultCurrency(): void
    {
        $config = new SystemConfig();
        $config->setValue('-99');
        $this->handler->map($config);

        $currency = $config->getItems();
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

        $currencyHandler = new CurrencyHandler(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope,
            $session
        );

        $this->handler = new DefaultCurrencyConfigMapper($currencyHandler);
    }
}
