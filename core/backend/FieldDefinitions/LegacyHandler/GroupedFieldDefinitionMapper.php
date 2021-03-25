<?php

namespace App\FieldDefinitions\LegacyHandler;

use App\Entity\FieldDefinition;

class GroupedFieldDefinitionMapper implements FieldDefinitionMapperInterface, GroupedFieldDefinitionMapperInterface
{
    /**
     * @var array
     */
    private $groupedFieldsTypeMap;

    /**
     * GroupedFieldDefinitionMapper constructor.
     * @param array $groupedFieldsTypeMap
     */
    public function __construct(array $groupedFieldsTypeMap)
    {
        $this->groupedFieldsTypeMap = $groupedFieldsTypeMap;
    }

    /**
     * @inheritDoc
     */
    public function getKey(): string
    {
        return 'grouped-fields';
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
     */
    public function map(FieldDefinition $definition): void
    {

        $vardefs = $definition->getVardef();

        if (empty($vardefs)) {
            return;
        }

        $typesConfig = $this->getGroupTypesConfig();

        foreach ($vardefs as $fieldName => $fieldDefinition) {
            $type = $fieldDefinition['type'] ?? '';
            $groupedType = $typesConfig[$type] ?? [];

            if (isset($fieldDefinition['legacyGroup']) && $fieldDefinition['legacyGroup'] === true) {
                continue;
            }

            $groupedFields = $this->getGroupFields($fieldDefinition, $groupedType, $type);

            if (empty($groupedFields)) {
                continue;
            }

            $this->setLayout($groupedType, $fieldDefinition, $groupedFields, $type, $vardefs);
            $this->setDisplay($groupedType, $fieldDefinition);
            $this->setShowLabel($groupedType, $fieldDefinition);

            $fieldDefinition['groupFields'] = $this->getGroupedFieldDefinitions($groupedFields, $vardefs);


            $fieldDefinition['type'] = 'grouped-field';

            $vardefs[$fieldName] = $fieldDefinition;
        }

        $definition->setVardef($vardefs);
    }

    /**
     * @inheritDoc
     */
    public function getGroupTypesConfig(): array
    {
        return $this->groupedFieldsTypeMap ?? [];
    }

    /**
     * @inheritDoc
     */
    public function setLayout(
        array $groupedType,
        array &$fieldDefinition,
        array $groupedFields,
        string $type,
        array $vardefs
    ): void {
        $layout = $groupedType['layout'] ?? [];

        if (!empty($fieldDefinition['layout'])) {
            $layout = $fieldDefinition['layout'];
        }

        if (empty($layout)) {
            $layout = $groupedFields;
        }

        $groupedKey = $fieldDefinition['groupKey'] ?? '';
        if ($groupedKey) {
            $layout = $this->getGroupKeyFields($layout, $type, $groupedKey);
        }

        $trimmedLayout = [];
        foreach ($layout as $item) {
            if (!in_array($item, $groupedFields, true)) {
                continue;
            }

            $definition = $vardefs[$item] ?? [];

            if (empty($definition)) {
                continue;
            }

            $trimmedLayout[] = $item;
        }

        $fieldDefinition['layout'] = $trimmedLayout;
    }

    /**
     * @inheritDoc
     */
    public function setDisplay(array $groupedType, array &$fieldDefinition): void
    {
        $display = $groupedType['display'] ?? '';

        if (!empty($fieldDefinition['display'])) {
            $display = $fieldDefinition['display'];
        }

        if (empty($display)) {
            $display = 'vertical';
        }

        $fieldDefinition['display'] = $display;
    }

    /**
     * @inheritDoc
     */
    public function setShowLabel(array $groupedType, array &$fieldDefinition): void
    {
        if (empty($groupedType['showLabel']) || !empty($fieldDefinition['showLabel'])) {
            return;
        }

        $fieldDefinition['showLabel'] = $groupedType['showLabel'];
    }

    /**
     * @inheritDoc
     */
    public function getGroupFields(array &$fieldDefinition, array $groupedType, string $type): array
    {
        $groupedKey = $fieldDefinition['groupKey'] ?? '';
        $groupedFields = [];

        if (!empty($groupedType['groupFields']) && $groupedKey === '') {
            $groupedFields = $groupedType['groupFields'] ?? [];
        }

        if (!empty($groupedType['groupFields']) && $groupedKey !== '') {
            $groupedFields = $this->getGroupKeyFields($groupedType['groupFields'], $type, $groupedKey);
        }

        if (!empty($fieldDefinition['groupFields'])) {
            $groupedFields = $fieldDefinition['groupFields'];
        }

        return $groupedFields;
    }

    /**
     * @inheritDoc
     */
    public function getGroupKeyFields(array $groupedFields, string $type, string $groupedKey): array
    {
        $mapped = [];
        foreach ($groupedFields as $groupField) {
            $mapped[] = $groupedKey . '_' . $type . '_' . $groupField;
        }

        return $mapped;
    }

    /**
     * Get grouped field definitions
     *
     * @param array $groupedFields
     * @param array|null $vardefs
     * @return array
     */
    protected function getGroupedFieldDefinitions(array $groupedFields, ?array $vardefs): array
    {
        $definitions = [];
        foreach ($groupedFields as $groupedField) {
            $definition = $vardefs[$groupedField] ?? [];

            if (empty($definition)) {
                continue;
            }

            $definitions[$groupedField] = $definition;
        }

        return $definitions;
    }
}
