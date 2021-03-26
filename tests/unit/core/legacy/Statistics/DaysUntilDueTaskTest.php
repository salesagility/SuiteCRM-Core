<?php
/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2021 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see http://www.gnu.org/licenses.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */


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
