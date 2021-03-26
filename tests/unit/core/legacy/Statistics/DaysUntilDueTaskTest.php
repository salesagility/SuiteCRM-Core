<?php

namespace App\Tests\unit\core\legacy\Statistics;

use App\Module\LegacyHandler\ModuleNameMapperHandler;
use App\Tests\_mock\Mock\core\legacy\Statistics\DaysUntilDueTaskMock;
use App\Tests\UnitTester;
use BeanFactory;
use Codeception\Test\Unit;
use DateInterval;
use DateTime;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Storage\MockArraySessionStorage;
use Exception;
use Task;


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

        $this->handler = new DaysUntilDueTaskMock(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope,
            $moduleNameMapper,
            $session
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
        $dateString = $this->getPastDateTimeString(2);
        $dateDue = $this->getPastDateTimeString(8);

        $bean = $this->buildTask($dateString, $dateDue);

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
        static::assertEquals('8', $result->getData()['value']);
    }

    /**
     * Test Due Date Calculation
     * @throws Exception
     */
    public function testDueDateCalculation(): void
    {
        $this->handler->reset();
        $dateString = $this->getPastDateTimeString(4);
        $dateDue = $this->getPastDateTimeString(2);
        $bean = $this->buildTask($dateString, $dateDue);
        $bean->status = 'In Progress';

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
     * @param int $days
     * @return string
     * @throws Exception
     */
    protected function getPastDateTimeString(int $days): string
    {
        $now = new DateTime();
        $now->sub(new DateInterval('P' . $days . 'DT1H'));

        return $now->format('Y-m-d H:i:s');
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
