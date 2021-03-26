<?php

namespace App\Routes\Service;

use Symfony\Component\HttpFoundation\Request;

class LegacyAssetRedirectHandler extends LegacyRedirectHandler
{
    /**
     * @var string[]
     */
    private $legacyAssetPaths;

    /**
     * LegacyAssetRedirectHandler constructor.
     * @param array $legacyAssetPaths
     * @param String $legacyPath
     */
    public function __construct(array $legacyAssetPaths, string $legacyPath)
    {
        parent::__construct($legacyPath);
        $this->legacyAssetPaths = $legacyAssetPaths;
    }

    /**
     * Check if the given $request is a legacy asset request
     *
     * @param Request $request
     * @return bool
     */
    public function isAssetRequest(Request $request): bool
    {
        return $this->inPathList($request, $this->legacyAssetPaths);
    }
}
