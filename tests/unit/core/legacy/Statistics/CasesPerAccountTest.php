<?php

namespace App\Tests\unit\core\legacy\Statistics;

use AcceptanceTester;
use App\Legacy\ModuleNameMapperHandler;
use App\Tests\UnitTester;
use Codeception\Test\Unit;
use Exception;
use Mock\Core\Legacy\Statistics\CasesPerAccountMock;

/**
 * Skip over incomplete test
 * @param AcceptanceTester $I
 * @skip Incomplete CasesPerAccountTest
 */


/**
 * Class CasesPerAccountTest
 * @package App\Tests
 */
class CasesPerAccountTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var CasesPerAccountMock
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


        $this->handler = new CasesPerAccountMock(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope,
            $moduleNameMapper
        );
    }

    /**
     * Skip over incomplete test
     * @skip Incomplete CasesPerAccountTest
     */

    public function testUnsupportedContextModule(): void
    {
        $this->handler->reset();

        $result = $this->handler->getData(
            [
                'context' => [
                ]
            ]
        );

        static::assertNotNull($result);
        static::assertNotNull($result->getData());
        static::assertNotNull($result->getMetadata());
        static::assertIsArray($result->getData());
        static::assertIsArray($result->getMetadata());
        static::assertEquals('cases-per-account', $result->getId());
        static::assertArrayHasKey('type', $result->getMetadata());
        static::assertEquals('single-value-statistic', $result->getMetadata()['type']);
        static::assertArrayHasKey('dataType', $result->getMetadata());
        static::assertEquals('varchar', $result->getMetadata()['dataType']);
        static::assertArrayHasKey('value', $result->getData());
        static::assertEquals('-', $result->getData()['value']);
    }


    /**
     * Skip over incomplete test
     * @skip Incomplete CasesPerAccountTest
     */

    public function testAmountofCases(): void
    {
        $this->handler->reset();

        $rows = [
            [
                'subject' => 'this is a test',
                'date_entered' => '2001-12-12 12:00:00',
            ],
        ];
        $this->handler->setMockQueryResult($rows);

        $result = $this->handler->getData(
            [
                'context' => [
                    'module' => 'cases',
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
        static::assertEquals('2', $result->getData()['value']);
        static::assertEquals('cases-per-accounts', $result->getId());
        static::assertArrayHasKey('type', $result->getMetadata());
        static::assertEquals('single-value-statistic', $result->getMetadata()['type']);
        static::assertArrayHasKey('dataType', $result->getMetadata());
        static::assertEquals('int', $result->getMetadata()['dataType']);
    }
}
