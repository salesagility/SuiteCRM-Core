<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\Request;

interface RouteConverterInterface
{
    /**
     * Check if the given $request route can be converted
     *
     * @param Request $request
     * @return bool
     */
    public function isLegacyRoute(Request $request): bool;

    /**
     * Convert given $request route
     *
     * @param Request $request
     * @return string
     */
    public function convert(Request $request): string;

    /**
     * Convert given $uri route
     *
     * @param string $uri
     * @return string
     */
    public function convertUri(string $uri): string;

    /**
     * Parse given $uri route
     *
     * @param string $uri
     * @return array
     */
    public function parseUri(string $uri): array;
}
