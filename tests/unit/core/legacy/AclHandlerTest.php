<?php

namespace App\Tests;

use ACLController;
use AspectMock\Test;
use Codeception\Test\Unit;
use Exception;
use App\Legacy\AclHandler;
use App\Legacy\ModuleNameMapperHandler;

class AclHandlerTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var AclHandler
     */
    protected $handler;

    /**
     * @throws Exception
     * @noinspection StaticClosureCanBeUsedInspection
     */
    protected function _before(): void
    {

        test::double(ACLController::class, [
            'checkAccess' => static function (
                /** @noinspection PhpUnusedParameterInspection */
                $category,
                $action,
                $is_owner = false,
                $type = 'module',
                $in_group = false
            ) {
                $map = [
                    'Accounts' => [
                        'edit' => true
                    ],
                    'Contacts' => [
                        'false' => true
                    ],
                ];

                return $map[$category][$action] ?? false;
            },
        ]);


        $moduleNameMapper = new ModuleNameMapperHandler(
            $this->tester->getProjectDir(),
            $this->tester->getLegacyDir(),
            $this->tester->getLegacySessionName(),
            $this->tester->getDefaultSessionName(),
            $this->tester->getLegacyScope()
        );

        test::double(AclHandler::class, [
            'startLegacyApp' => function (): void {
            },
        ]);

        $this->handler = new AclHandler(
            $this->tester->getProjectDir(),
            $this->tester->getLegacyDir(),
            $this->tester->getLegacySessionName(),
            $this->tester->getDefaultSessionName(),
            $this->tester->getLegacyScope(),
            $moduleNameMapper
        );

    }

    /**
     * Test Authorized Action check
     */
    public function testAuthorizedAction(): void
    {
        $hasAccess = $this->handler->checkAccess('accounts', 'edit');
        static::assertTrue($hasAccess);
    }

    /**
     * Test UnAuthorized Action check
     */
    public function testUnAuthorizedAction(): void
    {
        $hasAccess = $this->handler->checkAccess('contacts', 'edit');
        static::assertTrue($hasAccess);
    }
}
