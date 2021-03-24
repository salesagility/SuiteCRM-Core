<?php

namespace App\Security;

use Symfony\Component\HttpFoundation\Request;

/**
 * Interface RouteMatcherInterface
 * @package App\Security
 */
interface RouteMatcherInterface
{
    /**
     * @param Request $request
     * @param array $routes
     * @return mixed
     */
    public function match(Request $request, array $routes);
}
