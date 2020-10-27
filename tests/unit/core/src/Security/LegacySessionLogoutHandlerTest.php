<?php

namespace App\Tests;

use App\Security\LegacySessionLogoutHandler;
use AspectMock\Test;
use AuthenticationController;
use Codeception\Test\Unit;
use Exception;
use App\Legacy\Authentication;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Http\Logout\SessionLogoutHandler;

class LegacySessionLogoutHandlerTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var LegacySessionLogoutHandler
     */
    protected $handler;

    /**
     * @var bool
     */
    protected $decoratedCalled = false;

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

        /** @var SessionLogoutHandler $sessionLogoutHandler */
        $sessionLogoutHandler = $self->make(
            SessionLogoutHandler::class,
            [
                'logout' => static function (Request $request, Response $response, TokenInterface $token) use ($self) {
                    $self->decoratedCalled = true;
                }
            ]
        );

        $originalHandler = new Authentication(
            $this->tester->getProjectDir(),
            $this->tester->getLegacyDir(),
            $this->tester->getLegacySessionName(),
            $this->tester->getDefaultSessionName(),
            $this->tester->getLegacyScope()
        );

        $this->handler = new LegacySessionLogoutHandler($sessionLogoutHandler, $originalHandler);
    }

    protected function _after(): void
    {
        $this->logoutCalled = false;
        $this->initCalled = false;
        $this->closeCalled = false;
        $this->decoratedCalled = false;
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
        static::assertTrue($this->decoratedCalled);
    }
}
