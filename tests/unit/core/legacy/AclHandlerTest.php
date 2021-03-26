<?php

namespace App\Tests\unit\core\legacy;

use ACLController;
use App\Tests\UnitTester;
use AspectMock\Test;
use Codeception\Test\Unit;
use Exception;
use App\Engine\LegacyHandler\AclHandler;
use App\Module\LegacyHandler\ModuleNameMapperHandler;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Storage\MockArraySessionStorage;

/**
 * Class AclHandlerTest
 * @package App\Tests\unit\core\legacy
 */
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
            $moduleNameMapper,
            $session
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
