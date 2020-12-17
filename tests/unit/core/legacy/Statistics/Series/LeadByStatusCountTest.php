<?php

namespace App\Tests\unit\core\legacy\Statistics;

use App\Legacy\Data\RecordMapper;
use App\Legacy\ModuleNameMapperHandler;
use App\Service\LegacyFilterMapper;
use App\Tests\_mock\Mock\core\legacy\Data\ListDataQueryHandlerMock;
use App\Tests\_mock\Mock\core\legacy\Statistics\Series\LeadsByStatusCountMock;
use App\Tests\UnitTester;
use BeanFactory;
use Codeception\Test\Unit;
use Exception;

/**
 * Class LeadByStatusCountTest
 * @package App\Tests
 */
class LeadByStatusCountTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var LeadsByStatusCountMock
     */
    private $handler;

    /**
     * Test Unsupported context module
     * @throws Exception
     */
    public function testUnsupportedContextModule(): void
    {
        $this->handler->reset();

        $this->handler->setBean(BeanFactory::newBean('Leads'));

        $result = $this->handler->getData(
            [
                'context' => [
                    'id' => '12345',
                    'modules' => 'accounts'
                ]
            ]
        );

        static::assertNotNull($result);
        static::assertNotNull($result->getData());
        static::assertNotNull($result->getMetadata());
        static::assertIsArray($result->getData());
        static::assertIsArray($result->getMetadata());
        static::assertEquals('leads-by-status-count', $result->getId());
        static::assertArrayHasKey('type', $result->getMetadata());
        static::assertEquals('series-statistic', $result->getMetadata()['type']);
        static::assertArrayHasKey('dataType', $result->getMetadata());
        static::assertEquals('int', $result->getMetadata()['dataType']);
        static::assertArrayHasKey('multiSeries', $result->getData());
        static::assertArrayHasKey('singleSeries', $result->getData());
        static::assertEquals([], $result->getData()['multiSeries']);
        static::assertEquals([], $result->getData()['singleSeries']);
    }

    /**
     * Test get Total response
     * @throws Exception
     */
    public function testGetCountSeriesResponse(): void
    {
        $this->handler->reset();

        $this->handler->setBean(BeanFactory::newBean('Leads'));

        $rows = [
            ['name' => "Assigned", 'value' => "1"],
            ['name' => "Converted", 'value' => "3"],
            ['name' => "In Process", 'value' => "3"],
            ['name' => "Recycled", 'value' => "3"]
        ];
        $this->handler->setMockQueryResult($rows);

        $result = $this->handler->getData(
            [
                'context' => [
                    'module' => 'leads',
                    'id' => '12345',
                ]
            ]
        );

        static::assertNotNull($result);
        static::assertNotNull($result->getData());
        static::assertNotNull($result->getMetadata());
        static::assertIsArray($result->getData());
        static::assertIsArray($result->getMetadata());
        static::assertArrayHasKey('singleSeries', $result->getData());
        static::assertEquals($rows, $result->getData()['singleSeries']);
        static::assertEquals('leads-by-status-count', $result->getId());
        static::assertArrayHasKey('type', $result->getMetadata());
        static::assertEquals('series-statistic', $result->getMetadata()['type']);
        static::assertArrayHasKey('dataType', $result->getMetadata());
        static::assertEquals('int', $result->getMetadata()['dataType']);
    }

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

        $legacyFilterMapper = new LegacyFilterMapper([]);
        $recordMapper = new RecordMapper($moduleNameMapper);

        $queryHandler = new ListDataQueryHandlerMock($legacyFilterMapper, $recordMapper);

        $this->handler = new LeadsByStatusCountMock(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope,
            $queryHandler,
            $moduleNameMapper
        );
    }
}
