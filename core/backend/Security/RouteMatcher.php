<?php

namespace App\Security;

use Symfony\Component\HttpFoundation\Request;

/**
 * Class RouteMatcher
 * @package App\Security
 */
class RouteMatcher implements RouteMatcherInterface
{
    /**
     * @param Request $request
     * @param array $routes
     * @return bool|mixed
     */
    public function match(Request $request, array $routes)
    {
        foreach ($routes as $route) {
            if (empty($route['methods'])) {
                $methodMatch = true;
            } else {
                $methodMatch = false;
                foreach ($route['methods'] as $method) {
                    if (strtoupper($method) === $request->getMethod()) {
                        $methodMatch = true;
                        break;
                    }
                }
            }

            if (
                $methodMatch
                &&
                (empty($route['path']) || preg_match(sprintf('#%s#', $route['path']), $request->getPathInfo()))
                &&
                (empty($route['route']) || preg_match(sprintf('#%s#', $route['route']), $request->get('_route')))
                &&
                (empty($route['host']) || preg_match(sprintf('#%s#', $route['host']), $request->getHost()))
            ) {
                return true;
            }
        }

        return false;
    }
}
