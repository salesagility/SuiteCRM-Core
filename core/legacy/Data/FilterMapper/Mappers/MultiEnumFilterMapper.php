<?php

namespace App\Legacy\Data\FilterMapper\Mappers;

use App\Legacy\Data\FilterMapper\FilterMapperInterface;

class MultiEnumFilterMapper implements FilterMapperInterface
{
    /**
     * @inheritDoc
     */
    public function getType(): string
    {
        return 'multienum';
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

        return $criteriaItem['values'];
    }
}
