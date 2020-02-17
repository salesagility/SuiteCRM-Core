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
    protected const DEFAULT_ACTION = 'index';
    protected const LEGACY_ACTION_NAME_MAP_CONFIG_KEY = 'legacy.action_name_map';

    /**
     * @var ModuleNameMapper
     */
    protected $moduleNameMapper;

    /**
     * @var string[]
     */
    protected $map;


    /**
     * RouteConverter constructor.
     * @param ModuleNameMapper $moduleNameMapper
     * @param string[] $legacyActionNameMap
     */
    public function __construct(ModuleNameMapper $moduleNameMapper, array $legacyActionNameMap)
    {
        $this->moduleNameMapper = $moduleNameMapper;
        $this->map = $legacyActionNameMap;
    }

    /**
     * Check if the given $request route can be converted
     *
     * @param Request $request
     * @return bool
     */
    public function isLegacyRoute(Request $request): bool
    {
        if (!empty($request->getPathInfo()) && $request->getPathInfo() !== '/'){
            return false;
        }

        $module = $request->query->get('module');

        if (empty($module)) {
            return false;
        }

        if (!$this->moduleNameMapper->isValidModule($module)){
            return false;
        }

        $action = $request->query->get('action');

        return $this->isValidAction($action);
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

        if (empty($module)){
            throw new InvalidArgumentException('No module defined');
        }

        return $this->buildRoute($module, $action, $record);
    }

    /**
     * Check if given $action is valid
     * @param string|null $action
     * @return bool
     */
    protected function isValidAction(?string $action): bool
    {
        if (empty($action)) {
            return true;
        }

        if (!empty($this->getValidActions()[strtolower($action)])) {
            return true;
        }

        return false;
    }

    /**
     * Get map of valid action
     * @return array
     */
    protected function getValidActions(): array {
        return $this->map;
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
        $map = $this->getValidActions();

        if (empty($map[strtolower($action)])) {
            throw new InvalidArgumentException("No mapping for $action");
        }

        return $map[strtolower($action)];
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
}
