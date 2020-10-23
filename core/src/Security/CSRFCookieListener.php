<?php

namespace App\Security;

use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\HttpKernelInterface;

/**
 * Class CSRFCookieListener
 * @package App\Security
 */
class CSRFCookieListener
{
    /**
     * @var CSRFTokenManager
     */
    protected $csrfTokenManager;

    /**
     * @var array
     */
    protected $routes;
    /**
     * @var string
     */
    protected $cookieName;
    /**
     * @var int
     */
    protected $cookieExpire;
    /**
     * @var string
     */
    protected $cookiePath;
    /**
     * @var string
     */
    protected $cookieDomain;
    /**
     * @var bool
     */
    protected $cookieSecure;

    /**
     * @param CSRFTokenManager $angularCsrfTokenManager ,
     * @param array $routes
     * @param string $cookieName
     * @param int $cookieExpire
     * @param string $cookiePath
     * @param string $cookieDomain
     * @param bool $cookieSecure
     */
    public function __construct(
        CSRFTokenManager $angularCsrfTokenManager,
        array $routes,
        $cookieName,
        $cookieExpire,
        $cookiePath,
        $cookieDomain,
        $cookieSecure
    )
    {
        $this->csrfTokenManager = $angularCsrfTokenManager;
        $this->routes = $routes;
        $this->cookieName = $cookieName;
        $this->cookieExpire = $cookieExpire;
        $this->cookiePath = $cookiePath;
        $this->cookieDomain = $cookieDomain;
        $this->cookieSecure = $cookieSecure;
    }

    /**
     * @param ResponseEvent $event
     */
    public function onKernelResponse(ResponseEvent $event): void
    {
        if (
            HttpKernelInterface::MASTER_REQUEST !== $event->getRequestType()
        ) {
            return;
        }
        $event->getResponse()->headers->setCookie(new Cookie(
            $this->cookieName,
            $this->csrfTokenManager->getToken()->getValue(),
            0 === $this->cookieExpire ? $this->cookieExpire : time() + $this->cookieExpire,
            $this->cookiePath,
            $this->cookieDomain,
            $this->cookieSecure,
            false,
            false,
            Cookie::SAMESITE_LAX
        ));
    }
}
