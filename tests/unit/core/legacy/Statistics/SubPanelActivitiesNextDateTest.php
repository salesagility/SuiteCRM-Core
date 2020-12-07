<?php

namespace App\Tests\unit\core\legacy\Statistics;

use App\Legacy\ModuleNameMapperHandler;
use App\Tests\_mock\Mock\core\legacy\Statistics\SubPanelActivitiesNextDateMock;
use App\Tests\UnitTester;
use Codeception\Test\Unit;
use Exception;

/**
 * Class SubPanelActivitiesNextDateTest
 * @package App\Tests
 */
class SubPanelActivitiesNextDateTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var SubPanelActivitiesNextDateMock
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


        $this->handler = new SubPanelActivitiesNextDateMock(
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
                ]
            ]
        );

        static::assertNotNull($result);
        static::assertNotNull($result->getData());
        static::assertNotNull($result->getMetadata());
        static::assertIsArray($result->getData());
        static::assertIsArray($result->getMetadata());
        static::assertEquals('activities', $result->getId());
        static::assertArrayHasKey('type', $result->getMetadata());
        static::assertEquals('single-value-statistic', $result->getMetadata()['type']);
        static::assertArrayHasKey('dataType', $result->getMetadata());
        static::assertEquals('varchar', $result->getMetadata()['dataType']);
        static::assertArrayHasKey('value', $result->getData());
        static::assertEquals('-', $result->getData()['value']);
    }

    /**
     * Test Get Last Activities Date
     * @throws Exception
     */
    public function testGetLastActivitiesDate(): void
    {
        $this->handler->reset();

        $rows = [
            [
                'tasks_parent_date_start' => '12/12/2019',
            ],
            [
                'meetings_date_start' => '12/12/2019',
            ],
            [
                'calls_date_start' => '12/12/2019',
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
        static::assertEquals('12/12/2019', $result->getData()['value']);
        static::assertEquals('activities', $result->getId());
        static::assertArrayHasKey('type', $result->getMetadata());
        static::assertEquals('single-value-statistic', $result->getMetadata()['type']);
        static::assertArrayHasKey('dataType', $result->getMetadata());
        static::assertEquals('date', $result->getMetadata()['dataType']);
    }
}
