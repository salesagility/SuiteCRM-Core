<?php

namespace App\Legacy\Data\FilterMapper\Mappers;

use App\Legacy\Data\FilterMapper\FilterMapperInterface;
use App\Legacy\DateTimeHandler;

class DateTimeFilterMapper implements FilterMapperInterface
{
    /**
     * @var DateTimeHandler
     */
    private $dateTimeHandler;

    /**
     * DateFilterMapper constructor.
     * @param DateTimeHandler $dateTimeHandler
     */
    public function __construct(DateTimeHandler $dateTimeHandler)
    {
        $this->dateTimeHandler = $dateTimeHandler;
    }

    /**
     * @inheritDoc
     */
    public function getType(): string
    {
        return 'datetime';
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

        $mapped = [];

        foreach ($values as $value) {
            if (empty($value)) {
                continue;
            }
            $mapped[] = $this->dateTimeHandler->toUserDateTime($value);
        }

        $legacyValue = $mapped;
        if (count($mapped) === 1) {
            $legacyValue = $mapped[0];
        }

        return $legacyValue;
    }
}
