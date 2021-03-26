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


namespace App\Tests\unit\core\src\Service\RecordActions;

use App\Process\Entity\Process;
use App\Module\LegacyHandler\ModuleNameMapperHandler;
use App\Process\Service\BulkActions\DeleteRecordsBulkAction;
use App\Data\Service\RecordDeletionServiceInterface;
use App\Tests\UnitTester;
use Codeception\Test\Unit;
use Exception;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Storage\MockArraySessionStorage;

/**
 * Class DeleteRecordsBulkActionTest
 * @package App\Tests
 */
class DeleteRecordsBulkActionTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var DeleteRecordsBulkAction
     */
    protected $service;

    /**
     * @var boolean
     */
    protected $resultFlag = true;

    /**
     * @throws Exception
     */
    protected function _before(): void
    {
        $session = new Session(new MockArraySessionStorage('PHPSESSID'));
        $session->start();

        $moduleNameMapper = new ModuleNameMapperHandler(
            $this->tester->getProjectDir(),
            $this->tester->getLegacyDir(),
            $this->tester->getLegacySessionName(),
            $this->tester->getDefaultSessionName(),
            $this->tester->getLegacyScope(),
            $session
        );


        /** @var RecordDeletionServiceInterface $deletionService */
        $deletionService = $this->makeEmpty(
            RecordDeletionServiceInterface::class,
            [
                'deleteRecords' => function (
                    string $moduleName,
                    array $ids
                ): bool {
                    return !empty($moduleName) && !empty($ids) && $this->resultFlag;
                },
                'deleteRecordsFromCriteria' => function (
                    string $moduleName,
                    array $criteria,
                    array $sort
                ): bool {
                    return !empty($moduleName) && !empty($criteria) && !empty($sort) && $this->resultFlag;
                }
            ]
        );

        $this->service = new DeleteRecordsBulkAction(
            $moduleNameMapper,
            $deletionService
        );
    }

    /**
     * Test Successful Delete using ids
     */
    public function testSuccessfulDeleteUsingIds(): void
    {
        $this->resultFlag = true;
        $process = new Process();
        $process->setType('bulk-delete');
        $process->setOptions([
            'action' => 'bulk-delete',
            'ids' => ['e24be4e0-4424-9728-9294-5ea315eef53e', 'e24be4e0-4424-9728-9294-5ea315eef531'],
            'module' => 'contacts'
        ]);

        $this->service->run($process);

        static::assertSame([
            'reload' => true,
        ], $process->getData());

        static::assertEquals('success', $process->getStatus());
        static::assertSame(['LBL_BULK_ACTION_DELETE_SUCCESS'], $process->getMessages());
    }

    /**
     * Test Successful Delete using criteria
     */
    public function testSuccessfulDeleteUsingCriteria(): void
    {
        $this->resultFlag = true;
        $process = new Process();
        $process->setType('bulk-delete');
        $process->setOptions([
            'action' => 'bulk-delete',
            'ids' => '',
            'criteria' => ['filters' => []],
            'sort' => ['sortBy' => 'name'],
            'module' => 'contacts'
        ]);

        $this->service->run($process);

        static::assertSame([
            'reload' => true,
        ], $process->getData());

        static::assertEquals('success', $process->getStatus());
        static::assertSame(['LBL_BULK_ACTION_DELETE_SUCCESS'], $process->getMessages());
    }

    /**
     * Test Delete Error using ids
     */
    public function testDeleteErrorUsingIds(): void
    {
        $this->resultFlag = false;
        $process = new Process();
        $process->setType('bulk-delete');
        $process->setOptions([
            'action' => 'bulk-delete',
            'ids' => ['e24be4e0-4424-9728-9294-5ea315eef53e', 'e24be4e0-4424-9728-9294-5ea315eef531'],
            'module' => 'contacts'
        ]);

        $this->service->run($process);

        static::assertSame([
            'reload' => true,
        ], $process->getData());

        static::assertEquals('error', $process->getStatus());
        static::assertSame(['LBL_ACTION_ERROR'], $process->getMessages());
    }

    /**
     * Test Delete Error using criteria
     */
    public function testDeleteErrorUsingCriteria(): void
    {
        $this->resultFlag = false;
        $process = new Process();
        $process->setType('bulk-delete');
        $process->setOptions([
            'action' => 'bulk-delete',
            'ids' => '',
            'criteria' => ['filters' => []],
            'module' => 'contacts'
        ]);

        $this->service->run($process);

        static::assertSame([
            'reload' => true,
        ], $process->getData());

        static::assertEquals('error', $process->getStatus());
        static::assertSame(['LBL_ACTION_ERROR'], $process->getMessages());
    }
}
