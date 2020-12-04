<?php

namespace App\Tests\unit\core\legacy\Statistics;

use AcceptanceTester;
use App\Legacy\ModuleNameMapperHandler;
use App\Tests\UnitTester;
use Codeception\Test\Unit;
use Exception;
use Mock\Core\Legacy\Statistics\CasesPerAccountMock;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Storage\MockArraySessionStorage;
use Psr\Log\LoggerInterface;

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
        $session = new Session(new MockArraySessionStorage('PHPSESSID'));
        $session->start();

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
            $legacyScope,
            $session
        );


        $this->handler = new CasesPerAccountMock(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope,
            $moduleNameMapper,
            $session
        );

        /** @var LoggerInterface $logger */
        $logger = $this->makeEmpty(
            LoggerInterface::class,
            [
                'error' => static function ($message, array $context = array()): bool {
                    return $message || $context;
                }
            ]
        );

        $this->handler->setLogger($logger);
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
     * Test Amount of Cases
     * @throws Exception
     */
    public function testAmountofCases(): void
    {
        $this->handler->reset();

        $rows = [
            [
                'value' => '5',
            ],
        ];
        $this->handler->setMockQueryResult($rows);

        $result = $this->handler->getData([
            'context' => [
                'module' => 'cases',
                'id' => '12345',
            ]
        ]);

        static::assertNotNull($result);
        static::assertNotNull($result->getData());
        static::assertNotNull($result->getMetadata());
        static::assertIsArray($result->getData());
        static::assertIsArray($result->getMetadata());
        static::assertArrayHasKey('value', $result->getData());
        static::assertEquals('5', $result->getData()['value']);
        static::assertEquals('cases-per-account', $result->getId());
        static::assertArrayHasKey('type', $result->getMetadata());
        static::assertEquals('single-value-statistic', $result->getMetadata()['type']);
        static::assertArrayHasKey('dataType', $result->getMetadata());
        static::assertEquals('int', $result->getMetadata()['dataType']);
    }
}
