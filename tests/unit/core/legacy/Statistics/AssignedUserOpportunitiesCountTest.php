<?php

namespace App\Tests\unit\core\legacy\Statistics;

use App\Legacy\Data\PreparedStatementHandler;
use App\Legacy\ModuleNameMapperHandler;
use App\Tests\UnitTester;
use Codeception\Test\Unit;
use Exception;
use Mock\Core\Legacy\Statistics\AssignedUserOpportunitiesCountMock;
use Psr\Log\LoggerInterface;

/**
 * Class AssignedUserOpportunitiesCountTest
 * @package App\Tests
 */
class AssignedUserOpportunitiesCountTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var AssignedUserOpportunitiesCountMock
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

        $this->handler = new AssignedUserOpportunitiesCountMock(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope,
            $moduleNameMapper,
            $queryHandler
        );

        $this->handler->setLogger($logger);
    }

    /**
     * Test no context module
     * @throws Exception
     */
    public function testNoContextModule(): void
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
            ]
        ]);

        static::assertNotNull($result);
        static::assertNotNull($result->getData());
        static::assertNotNull($result->getMetadata());
        static::assertIsArray($result->getData());
        static::assertIsArray($result->getMetadata());
        static::assertEquals('assigned-user-opportunities-count', $result->getId());
        static::assertArrayHasKey('type', $result->getMetadata());
        static::assertEquals('single-value-statistic', $result->getMetadata()['type']);
        static::assertEquals('varchar', $result->getMetadata()['dataType']);
        static::assertArrayHasKey('value', $result->getData());
        static::assertEquals('-', $result->getData()['value']);
    }

    /**
     * Test unsupported module in the context
     * @throws Exception
     */
    public function testUnsupportedModuleContext(): void
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
                'module' => 'accounts',
                'id' => '12345',
            ]
        ]);

        static::assertNotNull($result);
        static::assertNotNull($result->getData());
        static::assertNotNull($result->getMetadata());
        static::assertIsArray($result->getData());
        static::assertIsArray($result->getMetadata());
        static::assertEquals('assigned-user-opportunities-count', $result->getId());
        static::assertArrayHasKey('type', $result->getMetadata());
        static::assertEquals('single-value-statistic', $result->getMetadata()['type']);
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
        static::assertEquals('assigned-user-opportunities-count', $result->getId());
        static::assertArrayHasKey('type', $result->getMetadata());
        static::assertEquals('single-value-statistic', $result->getMetadata()['type']);
        static::assertArrayHasKey('dataType', $result->getMetadata());
        static::assertEquals('int', $result->getMetadata()['dataType']);
    }
}
