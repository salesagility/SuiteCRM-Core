<?php

namespace App\Service;

use InvalidArgumentException;
use Symfony\Component\HttpFoundation\Request;

/**
 * Class RouteConverter
 *
 * @package SuiteCRM\Core\Legacy
 */
class RouteConverter
{
    /**
     * @var ModuleNameMapper
     */
    protected $moduleNameMapper;

    /**
     * @var ActionNameMapper
     */
    private $actionNameMapper;

    /**
     * RouteConverter constructor.
     * @param ModuleNameMapper $moduleNameMapper
     * @param ActionNameMapper $actionNameMapper
     */
    public function __construct(
        ModuleNameMapper $moduleNameMapper,
        ActionNameMapper $actionNameMapper
    ) {
        $this->moduleNameMapper = $moduleNameMapper;
        $this->actionNameMapper = $actionNameMapper;
    }

    /**
     * Check if the given $request route can be converted
     *
     * @param Request $request
     * @return bool
     */
    public function isLegacyRoute(Request $request): bool
    {
        if (!empty($request->getPathInfo()) && $request->getPathInfo() !== '/') {
            return false;
        }

        $module = $request->query->get('module');

        if (empty($module)) {
            return false;
        }

        if (!$this->moduleNameMapper->isValidModule($module)) {
            return false;
        }

        $action = $request->query->get('action');

        return $this->actionNameMapper->isValidAction($action);
    }

    /**
     * Convert given $request route
     *
     * @param Request $request
     * @return string
     */
    public function convert(Request $request): string
    {
        $module = $request->query->get('module');
        $action = $request->query->get('action');
        $record = $request->query->get('record');

        if (empty($module)) {
            throw new InvalidArgumentException('No module defined');
        }

        $route = $this->buildRoute($module, $action, $record);

        if (null !== $queryString = $request->getQueryString()) {
            $queryParams = $request->query->all();
            $queryString = '?' . $this->buildQueryString($queryParams, ['module', 'action', 'record']);
        }

        return $route . $queryString;
    }

    /**
     * Convert given $uri route
     *
     * @param string $uri
     * @return string
     */
    public function convertUri(string $uri): string
    {
        $request = Request::create($uri);

        return $this->convert($request);
    }

    /**
     * Parse given $uri route
     *
     * @param string $uri
     * @return array
     */
    public function parseUri(string $uri): array
    {
        $request = Request::create($uri);

        $module = $request->query->get('module');
        $action = $request->query->get('action');
        $record = $request->query->get('record');

        if (empty($module)) {
            throw new InvalidArgumentException('No module defined');
        }

        $route = $this->buildRoute($module, $action, $record);

        return [
            'route' => $route,
            'params' => $this->excludeParams($request->query->all(), ['module', 'action', 'record'])
        ];
    }

    /**
     * Build Suite 8 route
     *
     * @param string $module
     * @param string|null $action
     * @param string|null $record
     * @return string
     */
    protected function buildRoute(?string $module, ?string $action, ?string $record): string
    {
        $moduleName = $this->mapModule($module);
        $route = "./#/$moduleName";

        if (!empty($action)) {
            $actionName = $this->mapAction($action);
            $route .= "/$actionName";
        }

        if (!empty($record)) {
            $route .= "/$record";
        }

        return $route;
    }

    /**
     * Map action name
     * @param string $action
     * @return string
     */
    protected function mapAction(string $action): string
    {
        return $this->actionNameMapper->toFrontend($action);
    }

    /**
     * Map module name
     * @param string $module
     * @return string
     */
    protected function mapModule(string $module): string
    {
        return $this->moduleNameMapper->toFrontEnd($module);
    }

    /**
     * Build query string
     * @param array $queryParams
     * @param array $exclude
     * @return string
     */
    protected function buildQueryString(array $queryParams, array $exclude): string
    {
        $validParams = $this->excludeParams($queryParams, $exclude);

        return Request::normalizeQueryString(http_build_query($validParams));
    }

    /**
     * Build new array where list of query params are excluded
     * @param array $queryParams
     * @param array $exclude
     * @return array
     */
    protected function excludeParams(array $queryParams, array $exclude): array
    {
        $validParams = [];

        foreach ($queryParams as $name => $value) {
            if (in_array($name, $exclude)) {
                continue;
            }
            $validParams[$name] = $value;
        }

        return $validParams;
    }
}
