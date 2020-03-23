<?php


namespace App\Service;


use Symfony\Component\HttpFoundation\Request;

class LegacyAssetHandler
{
    /**
     * @var string[]
     */
    private $legacyAssetPaths;
    /**
     * @var String
     */
    private $legacyPath;

    /**
     * LegacyAssetHandler constructor.
     * @param array $legacyAssetPaths
     * @param String $legacyPath
     */
    public function __construct(array $legacyAssetPaths, String $legacyPath)
    {
        $this->legacyAssetPaths = $legacyAssetPaths;
        $this->legacyPath = $legacyPath;
    }

    /**
     * Check if the given $request is a legacy asset request
     *
     * @param Request $request
     * @return bool
     */
    public function isLegacyAssetRequest(Request $request): bool
    {
        if (empty($request->getPathInfo()) || $request->getPathInfo() === '/') {
            return false;
        }

        $pathParts = explode('/', $request->getPathInfo());

        if (empty($pathParts) || empty($pathParts[1])) {
            return false;
        }

        if (in_array($pathParts[1], $this->legacyAssetPaths)) {
            return true;
        }

        return false;
    }

    /**
     * Convert given $request route
     *
     * @param Request $request
     * @return string
     */
    public function convert(Request $request): string
    {

        if (null !== $queryString = $request->getQueryString()) {
            $queryString = '?' . $queryString;
        }

        return $request->getBaseUrl() . $this->legacyPath . $request->getPathInfo() . $queryString;
    }
}