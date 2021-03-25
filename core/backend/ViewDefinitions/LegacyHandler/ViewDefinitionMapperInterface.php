<?php

namespace App\ViewDefinitions\LegacyHandler;

use App\Entity\FieldDefinition;
use App\Entity\ViewDefinition;

interface ViewDefinitionMapperInterface
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
     * @param ViewDefinition $definition
     * @param FieldDefinition $fieldDefinition
     */
    public function map(ViewDefinition $definition, FieldDefinition $fieldDefinition): void;

}
