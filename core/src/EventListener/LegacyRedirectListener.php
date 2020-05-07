<?php

namespace App\EventListener;

use App\Service\LegacyApiRedirectHandler;
use App\Service\LegacyAssetRedirectHandler;
use App\Service\RouteConverter;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpKernel\Event\RequestEvent;

/**
 * Class LegacyRedirectListener
 * @package App\EventListener
 */
class LegacyRedirectListener
{
    /**
     * @var RouteConverter
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
     * LegacyRedirectListener constructor.
     * @param RouteConverter $routeConverter
     * @param LegacyAssetRedirectHandler $legacyAssetHandler
     * @param LegacyApiRedirectHandler $legacyApiRedirectHandler
     */
    public function __construct(
        RouteConverter $routeConverter,
        LegacyAssetRedirectHandler $legacyAssetHandler,
        LegacyApiRedirectHandler $legacyApiRedirectHandler
    ) {
        $this->routeConverter = $routeConverter;
        $this->legacyAssetHandler = $legacyAssetHandler;
        $this->legacyApiRedirectHandler = $legacyApiRedirectHandler;
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

        if ($this->isConvertible($event)) {
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

    /**
     * Check if it is legacy asset requests
     * @param RequestEvent $event
     * @return bool
     */
    protected function isLegacyAsset(RequestEvent $event): bool
    {
        return $this->legacyAssetHandler->isAssetRequest($event->getRequest());
    }

    /**
     * Check if it is legacy api requests
     * @param RequestEvent $event
     * @return bool
     */
    protected function isLegacyApi(RequestEvent $event): bool
    {
        return $this->legacyApiRedirectHandler->isApiRequest($event->getRequest());
    }
}