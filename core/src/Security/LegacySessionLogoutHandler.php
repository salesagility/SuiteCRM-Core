<?php

namespace App\Security;

use App\Legacy\Authentication;
use Symfony\Component\Security\Http\Event\LogoutEvent;

/**
 * Class LegacySessionLogoutHandler
 * @package App\Security
 */
class LegacySessionLogoutHandler
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
     * LegacySessionLogoutHandler constructor.
     * @param Authentication $authentication
     */
    public function __construct(
        Authentication $authentication
    ) {
        $this->authentication = $authentication;
    }

    /**
     * @param LogoutEvent $logoutEvent
     */
    public function onSymfonyComponentSecurityHttpEventLogoutEvent(LogoutEvent $logoutEvent): void
    {
        $this->authentication->logout();
        $logoutEvent->getRequest()->getSession()->invalidate();
    }
}
