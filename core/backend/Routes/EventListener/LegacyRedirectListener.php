<?php

namespace App\Routes\EventListener;

use App\Routes\Service\LegacyApiRedirectHandler;
use App\Routes\Service\LegacyAssetRedirectHandler;
use App\Routes\Service\LegacyNonViewActionRedirectHandler;
use App\Routes\Service\RouteConverterInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpKernel\Event\RequestEvent;

/**
 * Class LegacyRedirectListener
 * @package App\EventListener
 */
class LegacyRedirectListener
{
    /**
     * @var RouteConverterInterface
     */
    private $routeConverter;

    /**
     * @var LegacyAssetRedirectHandler
     */
    private $legacyAssetHandler;

    /**
     * @var LegacyApiRedirectHandler
     */
    private $legacyApiRedirectHandler;
    /**
     * @var LegacyNonViewActionRedirectHandler
     */
    private $legacyNonViewActionRedirectHandler;

    /**
     * LegacyRedirectListener constructor.
     * @param RouteConverterInterface $routeConverter
     * @param LegacyAssetRedirectHandler $legacyAssetHandler
     * @param LegacyApiRedirectHandler $legacyApiRedirectHandler
     * @param LegacyNonViewActionRedirectHandler $legacyNonViewActionRedirectHandler
     */
    public function __construct(
        RouteConverterInterface $routeConverter,
        LegacyAssetRedirectHandler $legacyAssetHandler,
        LegacyApiRedirectHandler $legacyApiRedirectHandler,
        LegacyNonViewActionRedirectHandler $legacyNonViewActionRedirectHandler
    ) {
        $this->routeConverter = $routeConverter;
        $this->legacyAssetHandler = $legacyAssetHandler;
        $this->legacyApiRedirectHandler = $legacyApiRedirectHandler;
        $this->legacyNonViewActionRedirectHandler = $legacyNonViewActionRedirectHandler;
    }

    /**
     * Re-direct user
     * @param RequestEvent $event
     */
    public function __invoke(RequestEvent $event): void
    {
        if ($this->isLegacyAsset($event)) {
            $url = $this->legacyAssetHandler->convert($event->getRequest());
            $response = new RedirectResponse($url);
            $event->setResponse($response);

            return;
        }

        if ($this->isLegacyApi($event)) {
            $url = $this->legacyApiRedirectHandler->convert($event->getRequest());
            $response = new RedirectResponse($url, 307);
            $event->setResponse($response);

            return;
        }

        if ($this->isLegacyViewRoute($event)) {
            $url = $this->routeConverter->convert($event->getRequest());
            $response = new RedirectResponse($url);
            $event->setResponse($response);
        }

        if ($this->isLegacyNonViewActionRoute($event)) {
            $url = $this->legacyNonViewActionRedirectHandler->convert($event->getRequest());
            $response = new RedirectResponse($url, 307);
            $event->setResponse($response);
        }
    }

    /**
     * Check if it is legacy asset request
     * @param RequestEvent $event
     * @return bool
     */
    protected function isLegacyAsset(RequestEvent $event): bool
    {
        return $this->legacyAssetHandler->isAssetRequest($event->getRequest());
    }

    /**
     * Check if it is legacy api request
     * @param RequestEvent $event
     * @return bool
     */
    protected function isLegacyApi(RequestEvent $event): bool
    {
        return $this->legacyApiRedirectHandler->isApiRequest($event->getRequest());
    }

    /**
     * Check if request is a legacy view request
     * @param RequestEvent $event
     * @return bool
     */
    protected function isLegacyViewRoute(RequestEvent $event): bool
    {
        return $this->routeConverter->isLegacyViewRoute($event->getRequest());
    }

    /**
     * Check if it is legacy non view request
     * @param RequestEvent $event
     * @return bool
     */
    protected function isLegacyNonViewActionRoute(RequestEvent $event): bool
    {
        return $this->legacyNonViewActionRedirectHandler->isMatch($event->getRequest());
    }
}
