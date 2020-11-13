<?php

namespace App\Tests\unit\core\legacy\Statistics;

use App\Legacy\ModuleNameMapperHandler;
use App\Tests\UnitTester;
use BeanFactory;
use Codeception\Test\Unit;
use Exception;
use DateInterval;
use DateTime;
use Task;
use Mock\Core\Legacy\Statistics\DaysUntilDueTaskMock;


/**
 * Class DaysUntilDueTaskTest
 * @package App\Tests
 */
class DaysUntilDueTaskTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var DaysUntilDueTaskMock
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

        $this->handler = new DaysUntilDueTaskMock(
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
        $dateString = $this->getPastDateString(2) . ' 12:00:00';
        $dateDue = $this->getPastDateString(1) . ' 12:00:00';
        $bean = $this->buildTask($dateString, $dateDue);

        $this->handler->setTask($bean);

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
        static::assertEquals('days-until-due-task', $result->getId());
        static::assertArrayHasKey('type', $result->getMetadata());
        static::assertEquals('single-value-statistic', $result->getMetadata()['type']);
        static::assertArrayHasKey('dataType', $result->getMetadata());
        static::assertEquals('varchar', $result->getMetadata()['dataType']);
        static::assertArrayHasKey('value', $result->getData());
        static::assertEquals('-', $result->getData()['value']);
    }

    /**
     * Test Overdue Calculation
     * @throws Exception
     */
    public function testOverdueCalculation(): void
    {
        $this->handler->reset();
        $dateString = $this->getPastDateString(2) . ' 12:00:00';
        $dateDue = $this->getPastDateString(2) . ' 10:00:00';
        $bean = $this->buildTask($dateString, $dateDue);

        $rows = [
            [
                'status' => 'In Progress',
                'date_due' => '2015-11-1 17:45:00',
                'date_entered' => '2020-10-01 17:45:00',
            ],
        ];
        $this->handler->setMockQueryResult($rows);

        $this->handler->setTask($bean);

        $result = $this->handler->getData(
            [
                'context' => [
                    'module' => 'tasks',
                    'id' => '12345',
                ]
            ]
        );

        static::assertNotNull($result);
        static::assertNotNull($result->getData());
        static::assertNotNull($result->getMetadata());
        static::assertIsArray($result->getData());
        static::assertIsArray($result->getMetadata());
        static::assertEquals('days-until-due-task', $result->getId());
        static::assertArrayHasKey('type', $result->getMetadata());
        static::assertEquals('single-value-statistic', $result->getMetadata()['type']);
        static::assertArrayHasKey('dataType', $result->getMetadata());
        static::assertEquals('int', $result->getMetadata()['dataType']);
        static::assertArrayHasKey('value', $result->getData());
        static::assertEquals('2', $result->getData()['value']);
    }

    /**
     * Test Due Date Calculation
     * @throws Exception
     */

    public function testDueDateCalculation(): void
    {
        $this->handler->reset();
        $dateString = $this->getPastDateString(4) . ' 16:00:00';
        $dateDue = $this->getPastDateString(2) . ' 10:00:00';
        $bean = $this->buildTask($dateString, $dateDue);

        $rows = [
            [
                'status' => 'In Progress',
                'date_due' => '2025-11-1 17:45:00',
                'date_entered' => '2020-10-01 17:45:00',
            ],
        ];
        $this->handler->setMockQueryResult($rows);

        $this->handler->setTask($bean);

        $result = $this->handler->getData(
            [
                'context' => [
                    'module' => 'tasks',
                    'id' => '12345',
                ]
            ]
        );

        static::assertNotNull($result);
        static::assertNotNull($result->getData());
        static::assertNotNull($result->getMetadata());
        static::assertIsArray($result->getData());
        static::assertIsArray($result->getMetadata());
        static::assertEquals('days-until-due-task', $result->getId());
        static::assertArrayHasKey('type', $result->getMetadata());
        static::assertEquals('single-value-statistic', $result->getMetadata()['type']);
        static::assertArrayHasKey('dataType', $result->getMetadata());
        static::assertEquals('int', $result->getMetadata()['dataType']);
        static::assertArrayHasKey('value', $result->getData());
        static::assertEquals('2', $result->getData()['value']);
    }


    /**
     * @param int $days
     * @return string
     * @throws Exception
     */
    protected function getPastDateString(int $days): string
    {
        $now = new DateTime();
        $now->sub(new DateInterval('P' . $days . 'D'));

        return $now->format('Y-m-d');
    }

    /**
     * @param string $dateDue
     * @param string $dateString
     * @return Task
     */
    protected function buildTask(string $dateString, string $dateDue): Task
    {
        /** @var Task $bean */
        $bean = BeanFactory::newBean('Tasks');
        $bean->date_entered = $dateString;
        $bean->date_due = $dateDue;
        $bean->id = '12345';

        return $bean;
    }
}
