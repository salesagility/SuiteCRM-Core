<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\Request;

class LegacyRedirectHandler
{
    /**
     * @var String
     */
    protected $legacyPath;

    /**
     * LegacyRedirectHandler constructor.
     * @param String $legacyPath
     */
    public function __construct(String $legacyPath)
    {
        $this->legacyPath = $legacyPath;
    }

    /**
     * Check if given request falls into one of the given $paths
     *
     * @param Request $request
     * @param array $paths
     * @return bool
     */
    protected function inPathList(Request $request, array $paths): bool
    {
        if (empty($request->getPathInfo()) || $request->getPathInfo() === '/') {
            return false;
        }

        foreach ($paths as $path) {
            if ($this->inPath($request, $path)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if request falls into given path
     *
     * @param Request $request
     * @param $path
     * @return bool
     */
    protected function inPath(Request $request, $path): bool
    {
        return strpos($request->getPathInfo(), '/' . $path) === 0;
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
