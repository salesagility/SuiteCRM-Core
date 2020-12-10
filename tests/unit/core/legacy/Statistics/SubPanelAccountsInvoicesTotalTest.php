<?php

namespace App\Tests\unit\core\legacy\Statistics;

use App\Legacy\ModuleNameMapperHandler;
use App\Tests\_mock\Mock\core\legacy\Statistics\SubPanelAccountsInvoicesTotalMock;
use App\Tests\UnitTester;
use Codeception\Test\Unit;
use Exception;

/**
 * Class SubPanelAccountsInvoicesTotal
 * @package App\Tests
 */
class SubPanelAccountsInvoicesTotalTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var SubPanelAccountsInvoicesTotalMock
     */
    private $handler;

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

        $moduleNameMapper = new ModuleNameMapperHandler(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope
        );


        $this->handler = new SubPanelAccountsInvoicesTotalMock(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope,
            $moduleNameMapper
        );
    }

    /**
     * Test Unsupported context module
     * @throws Exception
     */
    public function testUnsupportedContextModule(): void
    {
        $this->handler->reset();

        $result = $this->handler->getData(
            [
                'context' => [
                    'id' => '12345',
                ]
            ]
        );

        static::assertNotNull($result);
        static::assertNotNull($result->getData());
        static::assertNotNull($result->getMetadata());
        static::assertIsArray($result->getData());
        static::assertIsArray($result->getMetadata());
        static::assertEquals('accounts-invoices', $result->getId());
        static::assertArrayHasKey('type', $result->getMetadata());
        static::assertEquals('single-value-statistic', $result->getMetadata()['type']);
        static::assertArrayHasKey('dataType', $result->getMetadata());
        static::assertEquals('varchar', $result->getMetadata()['dataType']);
        static::assertArrayHasKey('value', $result->getData());
        static::assertEquals('-', $result->getData()['value']);
    }

    /**
     * Test get Total response
     * @throws Exception
     */
    public function testGetTotalResponse(): void
    {
        $this->handler->reset();

        $rows = [
            [
                'value' => '20',
            ],
        ];
        $this->handler->setMockQueryResult($rows);

        $result = $this->handler->getData(
            [
                'context' => [
                    'module' => 'accounts',
                    'id' => '12345',
                ]
            ]
        );

        static::assertNotNull($result);
        static::assertNotNull($result->getData());
        static::assertNotNull($result->getMetadata());
        static::assertIsArray($result->getData());
        static::assertIsArray($result->getMetadata());
        static::assertArrayHasKey('value', $result->getData());
        static::assertEquals('20', $result->getData()['value']);
        static::assertEquals('accounts-invoices', $result->getId());
        static::assertArrayHasKey('type', $result->getMetadata());
        static::assertEquals('single-value-statistic', $result->getMetadata()['type']);
        static::assertArrayHasKey('dataType', $result->getMetadata());
        static::assertEquals('int', $result->getMetadata()['dataType']);
    }
}
