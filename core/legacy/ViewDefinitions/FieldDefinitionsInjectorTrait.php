<?php


namespace SuiteCRM\Core\Legacy\ViewDefinitions;


trait FieldDefinitionsInjectorTrait
{
    private $defaultFields = [
        'type' => 'type',
        'label' => 'vname',
    ];

    /**
     * Add field definition to current view field metadata
     * @param array|null $vardefs
     * @param $name
     * @param $field
     * @param array $baseViewFieldDefinition
     * @return array
     */
    protected function addFieldDefinition(array &$vardefs, $name, $field, array $baseViewFieldDefinition): array
    {
        $baseField = $this->getField($field);

        $field = array_merge($baseViewFieldDefinition, $baseField);

        if (!isset($vardefs[$name])) {
            return $field;
        }

        $field['fieldDefinition'] = $vardefs[$name];

        $field = $this->applyDefaults($field);

        if ($field['name'] === 'email1') {
            $field['type'] = 'email';
            $column['link'] = false;
        }

        return $field;
    }

    /**
     * Get base field structure
     * @param $field
     * @return array
     */
    protected function getField($field): array
    {
        $baseField = $field;

        if (is_string($field)) {
            $baseField = [
                'name' => $field,
            ];
        }

        return $baseField;
    }

    /**
     * Apply defaults
     * @param array $field
     * @return array
     */
    protected function applyDefaults(array $field): array
    {
        foreach ($this->defaultFields as $attribute => $default) {
            if (empty($field[$attribute])) {
                $defaultValue = $field['fieldDefinition'][$default] ?? '';
                $field[$attribute] = $defaultValue;
            }
        }

        return $field;
    }

}
