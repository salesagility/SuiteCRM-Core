<?php

namespace App\Legacy\FieldDefinitions;

use App\Entity\FieldDefinition;

class LegacyGroupedFieldDefinitionMapper implements FieldDefinitionMapperInterface
{
    /**
     * @inheritDoc
     */
    public function getKey(): string
    {
        return 'legacy-grouped-fields';
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

        foreach ($vardefs as $fieldName => $fieldDefinition) {
            $group = $fieldDefinition['group'] ?? '';

            if (empty($group) || !empty($fieldDefinition['groupFields'])) {
                continue;
            }

            $groupedDefinition = $vardefs[$group] ?? [];
            if (empty($groupedDefinition)) {
                $groupedDefinition['type'] = 'grouped-field';
                $groupedDefinition['name'] = $group;
            }
            $groupedDefinition['legacyGroup'] = true;

            $definitions = $this->getGroupedFieldDefinitions($group, $vardefs);

            if ($group === $fieldName && count($definitions) === 1) {
                continue;
            }

            $groupedDefinition['groupFields'] = $definitions;

            $vardefs[$group] = $groupedDefinition;
        }

        $definition->setVardef($vardefs);
    }

    /**
     * Get grouped field definitions
     *
     * @param string $group
     * @param array|null $vardefs
     * @return array
     */
    protected function getGroupedFieldDefinitions(string $group, ?array $vardefs): array
    {
        $definitions = [];
        foreach ($vardefs as $vardef) {
            $fieldGroup = $vardef['group'] ?? '';
            if (empty($fieldGroup) || $fieldGroup !== $group) {
                continue;
            }

            $name = $vardef['name'] ?? '';

            $definitions[$name] = $vardef;
        }

        return $definitions;
    }

    /**
     * Set grouped fields display if not set
     *
     * @param $fieldDefinition
     */
    protected function setDefaultDisplay(&$fieldDefinition): void
    {
        if (empty($fieldDefinition['display'])) {
            $fieldDefinition['display'] = 'vertical';
        }
    }

    /**
     * Set grouped fields layout if not set
     *
     * @param $fieldDefinition
     * @param array $groupedFields
     */
    protected function setDefaultLayout(&$fieldDefinition, array $groupedFields): void
    {
        if (empty($fieldDefinition['layout'])) {
            $fieldDefinition['layout'] = $groupedFields;
        }
    }
}
