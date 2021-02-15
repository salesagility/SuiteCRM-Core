<?php

namespace App\Legacy\FieldDefinitions;

use App\Entity\FieldDefinition;

class LegacyReadOnlyFieldDefinitionMapper implements FieldDefinitionMapperInterface
{
    /**
     * @inheritDoc
     */

    public function getKey(): string
    {
        return 'legacy-readonly-fields';
    }

    /**
     * @inheritDoc
     */
    public function getModule(): string
    {
        return 'default';
    }

    /**
     * @inheritDoc
     * @param FieldDefinition $definition
     */
    public function map(FieldDefinition $definition): void
    {
        $vardefs = $definition->getVardef();
        foreach ($vardefs as $fieldName => $fieldDefinition) {

            $resultReadonlyDefinitions = $definition->getReadOnlyFieldDefinition($fieldDefinition);

            if (count($resultReadonlyDefinitions)) {

                $fieldDefinition['display'] = 'readonly';

                foreach (array_keys($resultReadonlyDefinitions) as $key) {
                    unset($fieldDefinition[$key]);
                }

                if (!isset($fieldDefinition['type'])) {
                    if (array_key_exists('dbType', $fieldDefinition)) {
                        $fieldDefinition['type'] = $fieldDefinition['dbType'];
                    } else {
                        $fieldDefinition['type'] = '';
                    }
                }

                //required(true) can't exist with readonly(true)
                if (isset($fieldDefinition['required']) && $fieldDefinition['required'] === true) {
                    $fieldDefinition['required'] = false;
                }

                $vardefs[$fieldName] = $fieldDefinition;
            }
        }
        $definition->setVardef($vardefs);
    }

}
