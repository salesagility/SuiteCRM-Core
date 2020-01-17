<?php

namespace App\EventListener;

use App\Service\RouteConverter;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpKernel\Event\RequestEvent;

/**
 * Class LegacyRedirectListener
 * @package App\EventListener
 */
class LegacyRedirectListener
{
    private $routeConverter;

    /**
     * LegacyRedirectListener constructor.
     * @param RouteConverter $routeConverter
     */
    public function __construct(RouteConverter $routeConverter)
    {
        $this->routeConverter = $routeConverter;
    }

    /**
     * Re-direct user
     * @param RequestEvent $event
     */
    public function __invoke(RequestEvent $event): void
    {
        if($this->isConvertible($event)){
            $url = $this->routeConverter->convert($event->getRequest());
            $response = new RedirectResponse($url);
            $event->setResponse($response);
        }
    }

    /**
     * Check if it is possible to convert the legacy request
     * @param RequestEvent $event
     * @return bool
     */
    protected function isConvertible(RequestEvent $event): bool
    {
        return $this->routeConverter->isLegacyRoute($event->getRequest());
    }
}