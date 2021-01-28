<?php

namespace App\Legacy\FieldDefinitions;

interface GroupedFieldDefinitionMapperInterface
{
    /**
     * Get default configurations for grouped types
     *
     * @return array
     */
    public function getGroupTypesConfig(): array;

    /**
     * Calculate and set layout
     * @param array $groupedType
     * @param array $fieldDefinition
     * @param array $groupedFields
     * @param string $type
     * @param array $vardefs
     * @return void
     */
    public function setLayout(
        array $groupedType,
        array &$fieldDefinition,
        array $groupedFields,
        string $type,
        array $vardefs
    ): void;

    /**
     * Calculate and set display
     *
     * @param array $groupedType
     * @param array $fieldDefinition
     * @return void
     */
    public function setDisplay(array $groupedType, array &$fieldDefinition): void;

    /**
     * Show Label
     * @param array $groupedType
     * @param array $fieldDefinition
     */
    public function setShowLabel(array $groupedType, array &$fieldDefinition): void;

    /**
     * Get group fields
     *
     * @param $fieldDefinition
     * @param array $groupedType
     * @param string $type
     * @return array
     */
    public function getGroupFields(array &$fieldDefinition, array $groupedType, string $type): array;

    /**
     * Map keys
     * @param array $groupedFields
     * @param string $type
     * @param string $groupedKey
     * @return array
     */
    public function getGroupKeyFields(array $groupedFields, string $type, string $groupedKey): array;
}
