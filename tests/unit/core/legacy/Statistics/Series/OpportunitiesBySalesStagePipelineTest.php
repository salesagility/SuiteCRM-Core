<?php

namespace App\Tests\unit\core\legacy\Statistics;

use App\Legacy\Data\FilterMapper\FilterMappers;
use App\Legacy\Data\FilterMapper\LegacyFilterMapper;
use App\Legacy\Data\RecordMapper;
use App\Legacy\ModuleNameMapperHandler;
use App\Tests\_mock\Mock\core\legacy\Data\ListDataQueryHandlerMock;
use App\Tests\_mock\Mock\core\legacy\Statistics\Series\OpportunitiesBySalesStagePipelineMock;
use App\Tests\UnitTester;
use BeanFactory;
use Codeception\Test\Unit;
use EmptyIterator;
use Exception;

/**
 * Class OpportunitiesBySalesStagePipelineTest
 * @package App\Tests
 */
class OpportunitiesBySalesStagePipelineTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var OpportunitiesBySalesStagePipelineMock
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

        $filterMappers = new FilterMappers(new EmptyIterator());
        $legacyFilterMapper = new LegacyFilterMapper([], $filterMappers);
        $recordMapper = new RecordMapper($moduleNameMapper);

        $queryHandler = new ListDataQueryHandlerMock($legacyFilterMapper, $recordMapper);

        $this->handler = new OpportunitiesBySalesStagePipelineMock(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope,
            $queryHandler,
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

        $this->handler->setBean(BeanFactory::newBean('Opportunities'));

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
        static::assertEquals('opportunities-by-sales-stage-price', $result->getId());
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
     * Test get values for chart
     * @throws Exception
     */
    public function testGetCountSeriesResponse(): void
    {
        $this->handler->reset();

        $this->handler->setBean(BeanFactory::newBean('Opportunities'));

        $rows = [
            [
                'sales_stage' => "Perception Analysis",
                'amount' => "1000",
            ],
            [
                'sales_stage' => "Closed Won",
                'amount' => "1000",
            ],
        ];
        $this->handler->setMockQueryResult($rows);

        $result = $this->handler->getData(
            [
                'context' => [
                    'module' => 'opportunities',
                    'id' => '12345',
                ]
            ]
        );

        $expectedResult = [
            [
                'name' => "Perception Analysis",
                'value' => "1000",
            ],
            [
                'name' => "Closed Won",
                'value' => "1000",
            ]
        ];

        static::assertNotNull($result);
        static::assertNotNull($result->getData());
        static::assertNotNull($result->getMetadata());
        static::assertIsArray($result->getData());
        static::assertIsArray($result->getMetadata());
        static::assertArrayHasKey('singleSeries', $result->getData());
        static::assertEquals($expectedResult, $result->getData()['singleSeries']);
        static::assertEquals('opportunities-by-sales-stage-price', $result->getId());
        static::assertArrayHasKey('type', $result->getMetadata());
        static::assertEquals('series-statistic', $result->getMetadata()['type']);
        static::assertArrayHasKey('dataType', $result->getMetadata());
        static::assertEquals('currency', $result->getMetadata()['dataType']);
    }

}
