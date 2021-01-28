<?php

namespace App\Legacy\FieldDefinitions;

use Traversable;

class FieldDefinitionMappers
{
    /**
     * @var FieldDefinitionMapperInterface[][]
     */
    protected $registry = [];

    /**
     * FieldDefinitionMappers constructor.
     * @param Traversable $handlers
     */
    public function __construct(Traversable $handlers)
    {
        /**
         * @var $handlers FieldDefinitionMapperInterface[]
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
     * @return FieldDefinitionMapperInterface[]
     */
    public function get(string $module): array
    {
        $defaultDefinitions = $this->registry['default'] ?? [];
        $moduleDefinitions = $this->registry[$module] ?? [];

        return array_merge($defaultDefinitions, $moduleDefinitions);
    }
}
