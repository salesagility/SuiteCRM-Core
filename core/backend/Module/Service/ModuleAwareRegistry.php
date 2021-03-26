<?php

namespace App\Module\Service;

use Traversable;

abstract class ModuleAwareRegistry
{
    /**
     * @var ModuleAwareRegistryItemInterface[][]
     */
    protected $registry = [];

    /**
     * SubpanelButtonMappers constructor.
     * @param Traversable $handlers
     */
    public function __construct(Traversable $handlers)
    {
        /**
         * @var $handlers ModuleAwareRegistryItemInterface[]
         */

        foreach ($handlers as $handler) {
            $type = $handler->getKey();
            $module = $handler->getModule();
            $mappers = $this->registry[$module] ?? [];
            $mappers[$type] = $handler;
            $this->registry[$module] = $mappers;
        }

    }

    /**
     * Get the items for the module key
     * @param string $module
     * @return ModuleAwareRegistryItemInterface[]
     */
    abstract public function get(string $module): array;

    /**
     * Get the items for the module key
     * @param string $module
     * @return ModuleAwareRegistryItemInterface[]
     */
    protected function retrieve(string $module): array
    {
        $defaultDefinitions = $this->registry['default'] ?? [];
        $moduleDefinitions = $this->registry[$module] ?? [];

        return array_merge($defaultDefinitions, $moduleDefinitions);
    }
}
