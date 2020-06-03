<?php

namespace App\Tests;

use Codeception\Test\Unit;
use Exception;
use SuiteCRM\Core\Legacy\CurrencyHandler;

class CurrencyHandlerTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var CurrencyHandler
     */
    protected $handler;

    /**
     * @throws Exception
     */
    protected function _before(): void
    {
        $projectDir = $this->tester->getProjectDir();
        $legacyDir = $this->tester->getLegacyDir();
        $legacySessionName = $this->tester->getLegacySessionName();
        $defaultSessionName = $this->tester->getDefaultSessionName();
        $legacyScope = $this->tester->getLegacyScope();

        $this->handler = new CurrencyHandler(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope
        );
    }

    // tests

    /**
     * Test retrieval of default currency
     */
    public function testDefaultCurrencyRetrieval(): void
    {
        $currency = $this->handler->getCurrency(null);
        static::assertNotNull($currency);
        static::assertNotEmpty($currency);

        static::assertArrayHasKey('id', $currency);
        static::assertNotEmpty($currency['id']);
        static::assertArrayHasKey('name', $currency);
        static::assertNotEmpty($currency['name']);
        static::assertArrayHasKey('symbol', $currency);
        static::assertNotEmpty($currency['symbol']);
        static::assertArrayHasKey('iso4217', $currency);
        static::assertNotEmpty($currency['iso4217']);
    }

    /**
     * Test retrieval of currency by id
     */
    public function testCurrencyRetrieval(): void
    {
        $currency = $this->handler->getCurrency(-99);
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
}
