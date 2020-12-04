<?php

namespace App\Tests\unit\core\legacy\Statistics;

use App\Legacy\Data\PreparedStatementHandler;
use App\Legacy\ModuleNameMapperHandler;
use App\Tests\UnitTester;
use Codeception\Test\Unit;
use Exception;
use Mock\Core\Legacy\Statistics\OpportunitySizeAnalysisMock;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Storage\MockArraySessionStorage;

/**
 * Class OpportunitySizeAnalysisTest
 * @package App\Tests
 */
class OpportunitySizeAnalysisTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var OpportunitySizeAnalysisMock
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

        /** @var PreparedStatementHandler $queryHandler */
        $queryHandler = $this->makeEmpty(
            PreparedStatementHandler::class
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

        $this->handler = new OpportunitySizeAnalysisMock(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope,
            $moduleNameMapper,
            $queryHandler,
            $session
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

        $result = $this->handler->getData([
            'context' => [
                'module' => 'accounts'
            ]
        ]);

        static::assertNotNull($result);
        static::assertNotNull($result->getData());
        static::assertNotNull($result->getMetadata());
        static::assertIsArray($result->getData());
        static::assertIsArray($result->getMetadata());
        static::assertEquals('opportunity-size-analysis', $result->getId());
        static::assertArrayHasKey('type', $result->getMetadata());
        static::assertEquals('single-value-statistic', $result->getMetadata()['type']);
        static::assertArrayHasKey('dataType', $result->getMetadata());
        static::assertEquals('varchar', $result->getMetadata()['dataType']);
        static::assertArrayHasKey('value', $result->getData());
        static::assertEquals('-', $result->getData()['value']);
    }

    /**
     * Test Get Opportunity Size Analysis Response
     * @throws Exception
     */
    public function testGetOpportunitySizeAnalysisResponse(): void
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
                'module' => 'opportunities',
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
        static::assertEquals('opportunity-size-analysis', $result->getId());
        static::assertArrayHasKey('type', $result->getMetadata());
        static::assertEquals('single-value-statistic', $result->getMetadata()['type']);
        static::assertArrayHasKey('dataType', $result->getMetadata());
        static::assertEquals('int', $result->getMetadata()['dataType']);
    }
}
