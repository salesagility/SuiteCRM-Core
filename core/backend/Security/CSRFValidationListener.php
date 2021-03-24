<?php

namespace App\Security;

use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\HttpKernelInterface;

/**
 * Class CSRFValidationListener
 * @package App\Security
 */
class CSRFValidationListener
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
     * @var RouteMatcherInterface
     */
    protected $routeMatcher;

    /**
     * @var string
     */
    protected $headerName;

    /**
     * CSRFValidationListener constructor.
     * @param CSRFTokenManager $angularCsrfTokenManager
     * @param RouteMatcherInterface $routeMatcher
     * @param array $routes
     * @param $headerName
     */
    public function __construct(
        CSRFTokenManager $angularCsrfTokenManager,
        RouteMatcherInterface $routeMatcher,
        array $routes,
        $headerName
    ) {
        $this->csrfTokenManager = $angularCsrfTokenManager;
        $this->routeMatcher = $routeMatcher;
        $this->routes = $routes;
        $this->headerName = $headerName;
    }

    /**
     * @param RequestEvent $event
     */
    public function onKernelRequest(RequestEvent $event): void
    {
        if (
            HttpKernelInterface::MASTER_REQUEST !== $event->getRequestType() ||
            !$this->routeMatcher->match($event->getRequest(), $this->routes)
        ) {
            return;
        }

        $value = $event->getRequest()->headers->get($this->headerName);
        if (!$value || !$this->csrfTokenManager->isTokenValid($value)) {
            throw new AccessDeniedHttpException('Invalid CSRF token');
        }
    }
}
