<?php


namespace SuiteCRM\Core\Legacy;


use App\Entity\FieldDefinition;

interface FieldDefinitionsProviderInterface
{
    /**
     * Get all exposed user preferences
     * @param string $moduleName
     * @return FieldDefinition
     */
    public function getVardef(string $moduleName): FieldDefinition;
}
