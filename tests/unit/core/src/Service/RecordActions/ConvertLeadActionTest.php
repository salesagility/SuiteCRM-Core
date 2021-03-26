<?php

namespace App\Tests\unit\core\src\Service\RecordActions;

use App\Process\Entity\Process;
use App\Module\LegacyHandler\ModuleNameMapperHandler;
use App\Process\Service\RecordActions\ConvertLeadAction;
use App\Tests\UnitTester;
use Codeception\Test\Unit;
use Exception;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Storage\MockArraySessionStorage;

/**
 * Class ConvertLeadActionTest
 * @package App\Tests
 */
class ConvertLeadActionTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var ConvertLeadAction
     */
    protected $service;

    /**
     * Test Convert redirect Info
     */
    public function testConvertRedirectInfo(): void
    {
        $process = new Process();
        $process->setType('record-convert-lead');
        $process->setOptions([
            'action' => 'record-convert-lead',
            'id' => 'e24be4e0-4424-9728-9294-5ea315eef53e',
            'module' => 'leads'
        ]);

        $this->service->run($process);

        static::assertSame([
            'handler' => 'redirect',
            'params' => [
                'route' => 'leads/convert-lead/e24be4e0-4424-9728-9294-5ea315eef53e',
                'queryParams' => [
                ]
            ]
        ], $process->getData());

        static::assertEquals('success', $process->getStatus());
        static::assertSame([], $process->getMessages());
    }

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

        $this->service = new ConvertLeadAction(
            $moduleNameMapper
        );
    }
}
