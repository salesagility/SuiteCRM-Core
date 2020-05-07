<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\Request;

class LegacyApiRedirectHandler extends LegacyRedirectHandler
{
    /**
     * @var string[]
     */
    private $legacyApiPaths;

    /**
     * LegacyApiRedirectHandler constructor.
     * @param array $legacyApiPaths
     * @param String $legacyPath
     */
    public function __construct(array $legacyApiPaths, String $legacyPath)
    {
        parent::__construct($legacyPath);
        $this->legacyApiPaths = $legacyApiPaths;
    }

    /**
     * Check if the given $request is a legacy api request
     *
     * @param Request $request
     * @return bool
     */
    public function isApiRequest(Request $request): bool
    {
        return $this->inPathList($request, array_keys($this->legacyApiPaths));
    }

    /**
     * Convert given $request route
     *
     * @param Request $request
     * @return string
     */
    public function convert(Request $request): string
    {
        $legacyPath = parent::convert($request);

        foreach ($this->legacyApiPaths as $path => $replace) {
            if ($this->inPath($request, $path)) {
                return str_replace($path, $replace, $legacyPath);
            }
        }

        return $legacyPath;
    }
}
