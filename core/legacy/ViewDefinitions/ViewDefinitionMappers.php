<?php

namespace App\Legacy\ViewDefinitions;

use Traversable;

class ViewDefinitionMappers
{
    /**
     * @var ViewDefinitionMapperInterface[][]
     */
    protected $registry = [];

    /**
     * ViewDefinitionMappers constructor.
     * @param Traversable $handlers
     */
    public function __construct(Traversable $handlers)
    {
        /**
         * @var $handlers ViewDefinitionMapperInterface[]
         */

        foreach ($handlers as $handler) {
            $type = $handler->getKey();
            $module = $handler->getModule();
            $fieldDefinitions = $this->registry[$module] ?? [];
            $fieldDefinitions[$type] = $handler;
            $this->registry[$module] = $fieldDefinitions;
        }

    }

    /**
     * Get the mappers for the module key
     * @param string $module
     * @return ViewDefinitionMapperInterface[]
     */
    public function get(string $module): array
    {
        $defaultDefinitions = $this->registry['default'] ?? [];
        $moduleDefinitions = $this->registry[$module] ?? [];

        return array_merge($defaultDefinitions, $moduleDefinitions);
    }
}
