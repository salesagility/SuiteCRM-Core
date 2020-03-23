<?php

namespace App\EventListener;

use App\Service\LegacyAssetHandler;
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
     * @var LegacyAssetHandler
     */
    private $legacyAssetHandler;

    /**
     * LegacyRedirectListener constructor.
     * @param RouteConverter $routeConverter
     * @param LegacyAssetHandler $legacyAssetHandler
     */
    public function __construct(RouteConverter $routeConverter, LegacyAssetHandler $legacyAssetHandler)
    {
        $this->routeConverter = $routeConverter;
        $this->legacyAssetHandler = $legacyAssetHandler;
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
        return $this->legacyAssetHandler->isLegacyAssetRequest($event->getRequest());
    }
}