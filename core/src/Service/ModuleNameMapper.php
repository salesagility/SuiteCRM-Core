<?php


namespace App\Service;

use InvalidArgumentException;

/**
 * Class ModuleNameMapper
 * @package SuiteCRM\Core\Legacy
 */
class ModuleNameMapper
{
    protected const FRONTEND = 'frontend';
    protected const CORE = 'core';

    /**
     * @var array
     */
    protected $map;

    /**
     * @var array
     */
    protected $frontEndToLegacyMap;

    /**
     * ModuleNameMapper constructor.
     * @param array $legacyModuleNameMap
     */
    public function __construct(array $legacyModuleNameMap)
    {
        $this->map = $legacyModuleNameMap;

        foreach ($this->map as $legacyName => $names) {
            $this->frontEndToLegacyMap[$names[self::FRONTEND]] = $legacyName;
        }
    }

    /**
     * Check if module is valid
     * @param string $module
     * @return bool
     */
    public function isValidModule(string $module): bool
    {
        if (empty($this->map[$module])) {
            return false;
        }

        return true;
    }

    /**
     * Map legacy module name to frontend name
     * @param string $module
     * @return string
     */
    public function toFrontEnd(string $module): string
    {
        return $this->mapName($module, self::FRONTEND);
    }

    /**
     * Map legacy module name to core name
     * @param string $module
     * @return string
     */
    public function toCore(string $module): string
    {
        return $this->mapName($module, self::CORE);
    }

    /**
     * Map FrontEnd legacy module name to legacy name
     * @param string $module
     * @return string
     */
    public function toLegacy(string $module): string
    {
        if (empty($this->frontEndToLegacyMap[$module])) {
            throw new InvalidArgumentException("No legacy mapping for $module");
        }

        return $this->frontEndToLegacyMap[$module];
    }

    /**
     * Get legacy to fronted module name map
     * @return array
     */
    public function getLegacyToFrontendMap(): array
    {
        $legacyToFrontendMap = [];

        foreach ($this->map as $legacyName => $names) {
            $legacyToFrontendMap[$legacyName] = $names[self::FRONTEND];
        }

        return $legacyToFrontendMap;
    }

    /**
     * Map module name
     * @param string $module
     * @param string $type
     * @return mixed
     */
    protected function mapName(string $module, string $type)
    {

        if (empty($this->map[$module]) || empty($this->map[$module][$type])) {
            throw new InvalidArgumentException("No mapping for $module");
        }

        return $this->map[$module][$type];
    }
}