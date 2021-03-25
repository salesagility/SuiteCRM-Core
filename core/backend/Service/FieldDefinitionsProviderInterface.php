<?php


namespace App\Service;


use App\FieldDefinitions\Entity\FieldDefinition;

interface FieldDefinitionsProviderInterface
{
    /**
     * Get all exposed user preferences
     * @param string $moduleName
     * @return FieldDefinition
     */
    public function getVardef(string $moduleName): FieldDefinition;
}
