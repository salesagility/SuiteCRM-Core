<?php


namespace App\Security;


use App\Legacy\Authentication;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Http\Logout\LogoutHandlerInterface;
use Symfony\Component\Security\Http\Logout\SessionLogoutHandler;

class LegacySessionLogoutHandler implements LogoutHandlerInterface
{
    /**
     * @var Authentication
     */
    protected $authentication;
    /**
     * @var SessionLogoutHandler
     */
    private $decorated;

    /**
     * SessionSubscriber constructor.
     * @param SessionLogoutHandler $decorated
     * @param Authentication $authentication
     */
    public function __construct(
        SessionLogoutHandler $decorated,
        Authentication $authentication
    ) {
        $this->decorated = $decorated;
        $this->authentication = $authentication;
    }

    /**
     * @inheritDoc
     */
    public function logout(Request $request, Response $response, TokenInterface $token): void
    {
        $this->authentication->logout();
        $this->decorated->logout($request, $response, $token);
    }
}
