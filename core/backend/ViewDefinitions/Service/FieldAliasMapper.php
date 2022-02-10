<?php

namespace App\ViewDefinitions\Service;

/**
 * Class FieldAliasMapper
 * @package App\ViewDefinitions\Service
 */
class FieldAliasMapper
{
    /**
     * @var array
     */
    protected $aliasMap;

    /**
     * FieldAliasMapper constructor.
     * @param array $viewMetadataFieldAliasMap
     */
    public function __construct(array $viewMetadataFieldAliasMap)
    {
        $this->aliasMap = $viewMetadataFieldAliasMap;
    }


    /**
     * @param array $fieldDefinition
     * @return string
     */
    public function map(array $fieldDefinition): string
    {
        $type = $fieldDefinition['type'] ?? '';
        $name = $fieldDefinition['name'] ?? '';

        if ($type === '' || $name === '') {
            return $name;
        }

        $alias = $this->replaceInString($fieldDefinition, $this->aliasMap['type'][$type]['alias'] ?? '');

        if ($alias === '') {
            return $name;
        }

        return $alias;
    }

    /**
     * Replace field defs in string
     *
     * @param array $fieldDefinition
     * @param string $value
     * @return string
     */
    protected function replaceInString(array $fieldDefinition, ?string $value): string
    {
        if (empty($value)) {
            return $value;
        }

        [$search, $replace] = $this->getReplacements($fieldDefinition);

        return str_replace(
            $search,
            $replace,
            $value
        );
    }

    /**
     * Get replacement search value and replace value
     *
     * @param array $fieldDefinition
     * @return array
     */
    protected function getReplacements(array $fieldDefinition): array
    {
        $search = [];
        $replace = [];
        foreach ($fieldDefinition as $key => $value) {
            if (!is_string($value)) {
                continue;
            }

            $search[] = '{' . $key . '}';
            $replace[] = $value;
        }

        return [$search, $replace];
    }
}
