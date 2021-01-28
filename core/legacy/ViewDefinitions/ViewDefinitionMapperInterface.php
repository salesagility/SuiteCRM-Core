<?php

namespace App\Legacy\ViewDefinitions;

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
     * @return mixed
     */
    public function map(ViewDefinition $definition, FieldDefinition $fieldDefinition): void;
}
