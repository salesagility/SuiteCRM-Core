<?php

namespace App\Tests\unit\core\src\Service\RecordActions;

use App\Entity\Process;
use App\Legacy\ModuleNameMapperHandler;
use App\Service\RecordActions\DeleteRecordAction;
use App\Service\RecordDeletionServiceInterface;
use App\Tests\UnitTester;
use Codeception\Test\Unit;
use Exception;

/**
 * Class DeleteRecordActionTest
 * @package App\Tests
 */
class DeleteRecordActionTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var DeleteRecordAction
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

        $moduleNameMapper = new ModuleNameMapperHandler(
            $this->tester->getProjectDir(),
            $this->tester->getLegacyDir(),
            $this->tester->getLegacySessionName(),
            $this->tester->getDefaultSessionName(),
            $this->tester->getLegacyScope()
        );


        /** @var RecordDeletionServiceInterface $deletionService */
        $deletionService = $this->makeEmpty(
            RecordDeletionServiceInterface::class,
            [
                'deleteRecord' => function (
                    string $moduleName,
                    string $id
                ): bool {
                    return !empty($moduleName) && !empty($id) && $this->resultFlag;
                }
            ]
        );

        $this->service = new DeleteRecordAction(
            $moduleNameMapper,
            $deletionService
        );
    }

    /**
     * Test Successful Delete
     */
    public function testSuccessfulDelete(): void
    {
        $this->resultFlag = true;
        $process = new Process();
        $process->setType('record-delete');
        $process->setOptions([
            'action' => 'record-delete',
            'id' => 'e24be4e0-4424-9728-9294-5ea315eef53e',
            'module' => 'contacts'
        ]);

        $this->service->run($process);

        static::assertSame([
            'handler' => 'redirect',
            'params' => [
                'route' => 'contacts',
                'queryParams' => []
            ]
        ], $process->getData());

        static::assertEquals('success', $process->getStatus());
        static::assertSame(['LBL_RECORD_DELETE_SUCCESS'], $process->getMessages());
    }

    /**
     * Test Delete Error
     */
    public function testDeleteError(): void
    {
        $this->resultFlag = false;
        $process = new Process();
        $process->setType('record-delete');
        $process->setOptions([
            'action' => 'record-delete',
            'id' => 'e24be4e0-4424-9728-9294-5ea315eef53e',
            'module' => 'contacts'
        ]);

        $this->service->run($process);

        static::assertNull($process->getData());

        static::assertEquals('error', $process->getStatus());
        static::assertSame(['LBL_ACTION_ERROR'], $process->getMessages());
    }
}
