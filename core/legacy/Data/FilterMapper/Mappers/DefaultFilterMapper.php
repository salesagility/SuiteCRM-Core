<?php

namespace App\Legacy\Data\FilterMapper\Mappers;

use App\Legacy\Data\FilterMapper\FilterMapperInterface;

class DefaultFilterMapper implements FilterMapperInterface
{
    /**
     * @inheritDoc
     */
    public function getType(): string
    {
        return 'default';
    }

    /**
     * @inheritDoc
     */
    public function mapValue(string $mappedValue, array $criteriaItem)
    {
        /** @var array */
        $values = $criteriaItem['values'] ?? [];

        if (empty($values)) {
            return [];
        }

        $legacyValue = $values;
        if (count($values) === 1) {
            $legacyValue = $values[0];
        }

        return $legacyValue;
    }
}
