<?php

namespace App\Tests\unit\core\src\Service\RecordActions;

use App\Entity\Process;
use App\Legacy\ModuleNameMapperHandler;
use App\Service\BulkActions\MergeRecordsBulkAction;
use App\Tests\UnitTester;
use Codeception\Test\Unit;
use Exception;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Storage\MockArraySessionStorage;

/**
 * Class MergeRecordsBulkActionTest
 * @package App\Tests
 */
class MergeRecordsBulkActionTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var MergeRecordsBulkAction
     */
    protected $service;

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

        $this->service = new MergeRecordsBulkAction(
            $moduleNameMapper
        );
    }

    /**
     * Test Successful Delete
     */
    public function testMergeRedirectInfo(): void
    {
        $process = new Process();
        $process->setType('bulk-merge');
        $process->setOptions([
            'action' => 'bulk-merge',
            'ids' => ['e24be4e0-4424-9728-9294-5ea315eef53e', 'e24be4e0-4424-9728-9294-5ea315eef531'],
            'module' => 'contacts'
        ]);

        $this->service->run($process);

        static::assertSame([

            'handler' => 'redirect',
            'params' => [
                'route' => 'merge-records/index',
                'queryParams' => [
                    'action_module' => 'Contacts',
                    'uid' => "e24be4e0-4424-9728-9294-5ea315eef53e,e24be4e0-4424-9728-9294-5ea315eef531",
                    'return_module' => 'Contacts',
                    'return_action' => 'index',
                ]
            ]
        ], $process->getData());

        static::assertEquals('success', $process->getStatus());
        static::assertSame([], $process->getMessages());
    }
}
