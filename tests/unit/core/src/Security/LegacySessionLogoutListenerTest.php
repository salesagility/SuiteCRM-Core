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


namespace App\Tests\unit\core\src\Security;

use App\Security\LegacySessionLogoutListener;
use App\Tests\UnitTester;
use AspectMock\Test;
use AuthenticationController;
use Codeception\Test\Unit;
use Exception;
use App\Authentication\LegacyHandler\Authentication;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Storage\MockArraySessionStorage;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Http\Logout\SessionLogoutListener;

/**
 * Class LegacySessionLogoutListenerTest
 * @package App\Tests\unit\core\src\Security
 */
class LegacySessionLogoutListenerTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var LegacySessionLogoutListener
     */
    protected $handler;

    /**
     * @var bool
     */
    public $logoutCalled = false;

    /**
     * @var bool
     */
    public $initCalled = false;

    /**
     * @var bool
     */
    public $closeCalled = false;


    /**
     * @throws Exception
     * @noinspection StaticClosureCanBeUsedInspection
     */
    protected function _before(): void
    {
        $self = $this;

        test::double(Authentication::class, [
            'getAuthenticationController' => function () use ($self) {

                return $self->make(
                    AuthenticationController::class,
                    [
                        'logout' => function () use ($self) {
                            $self->logoutCalled = true;

                            return true;
                        }
                    ]
                );
            },
            'init' => function () use ($self) {
                $self->initCalled = true;
            },
            'close' => function () use ($self) {
                $self->closeCalled = true;
            }
        ]);

        $session = new Session(new MockArraySessionStorage('PHPSESSID'));
        $session->start();

        $originalHandler = new Authentication(
            $this->tester->getProjectDir(),
            $this->tester->getLegacyDir(),
            $this->tester->getLegacySessionName(),
            $this->tester->getDefaultSessionName(),
            $this->tester->getLegacyScope(),
            $session
        );

        $this->handler = $originalHandler;
    }

    protected function _after(): void
    {
        $this->logoutCalled = false;
        $this->initCalled = false;
        $this->closeCalled = false;
    }

    // tests

    /**
     * Test that legacy logout is called
     * @throws Exception
     */
    public function testLegacyLogoutCalled(): void
    {
        $request = new Request();
        $response = new Response();
        $token = $this->makeEmpty(TokenInterface::class, []);
        /** @var TokenInterface $token */
        $this->handler->logout($request, $response, $token);

        static::assertTrue($this->logoutCalled);
        static::assertTrue($this->initCalled);
        static::assertTrue($this->logoutCalled);
    }
}
