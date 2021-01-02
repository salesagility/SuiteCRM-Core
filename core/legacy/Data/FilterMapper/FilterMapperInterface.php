<?php

namespace App\Legacy\Data\FilterMapper;

interface FilterMapperInterface
{
    /**
     * Get the field type it applies to
     * @return string
     */
    public function getType(): string;

    /**
     * Map value
     * @param string $mappedValue
     * @param array $criteriaItem
     * @return mixed|string|string[]
     */
    public function mapValue(string $mappedValue, array $criteriaItem);
}
