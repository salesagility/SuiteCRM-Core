<?php

namespace App\FieldDefinitions\LegacyHandler;

use App\FieldDefinitions\Entity\FieldDefinition;

interface FieldDefinitionMapperInterface
{
    /**
     * Get the mapper key
     * @return string
     */
    public function getKey(): string;

    /**
     * Get the module key
     * @return string
     */
    public function getModule(): string;

    /**
     * Map value
     * @param FieldDefinition $definition
     * @return mixed
     */
    public function map(FieldDefinition $definition): void;
}
