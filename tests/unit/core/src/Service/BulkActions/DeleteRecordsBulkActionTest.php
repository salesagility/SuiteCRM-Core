<?php

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
