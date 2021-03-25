<?php

namespace App\Data\LegacyHandler\FilterMapper;

class LegacyFilterMapper
{
    /**
     * @var array
     */
    private $filterOperatorMap;
    /**
     * @var FilterMappers
     */
    private $mappers;

    /**
     * LegacyFilterMapper constructor.
     * @param array $filterOperatorMap
     * @param FilterMappers $mappers
     */
    public function __construct(array $filterOperatorMap, FilterMappers $mappers)
    {
        $this->filterOperatorMap = $filterOperatorMap;
        $this->mappers = $mappers;
    }

    /**
     * Map Filters to legacy
     * @param array $criteria
     * @param string $type
     * @return array
     */
    public function mapFilters(array $criteria, string $type): array
    {
        $mapped = [];

        if (empty($criteria['filters'])) {
            return $mapped;
        }

        foreach ($criteria['filters'] as $key => $item) {
            if (empty($item['operator'])) {
                continue;
            }

            if (empty($this->filterOperatorMap[$item['operator']])) {
                continue;
            }

            $mapConfig = $this->filterOperatorMap[$item['operator']];

            foreach ($mapConfig as $mappedKey => $mappedValue) {
                $legacyKey = $this->mapFilterKey($type, $key, $mappedKey);
                $legacyValue = $this->mapFilterValue($mappedValue, $item);

                $mapped[$legacyKey] = $legacyValue;
            }
        }

        return $mapped;
    }

    /**
     * Map Filter key to legacy
     * @param string $type
     * @param string $key
     * @param string $mappedKey
     * @return string|string[]
     */
    protected function mapFilterKey(string $type, string $key, string $mappedKey): string
    {
        return str_replace(array('{field}', '{type}'), array($key, $type), $mappedKey);
    }

    /**
     * Map Filter value to legacy
     * @param string $mappedValue
     * @param array $item
     * @return mixed|string|string[]
     */
    protected function mapFilterValue(string $mappedValue, array $item)
    {
        $fieldType = $item['fieldType'] ?? '';


        if ($mappedValue === 'values') {

            if ($this->mappers->hasMapper($fieldType)) {
                return $this->mappers->get($fieldType)->mapValue($mappedValue, $item);
            }

            return $this->mappers->get('default')->mapValue($mappedValue, $item);
        }

        $operator = $item['operator'] ?? '';
        $start = $item['start'] ?? '';
        $end = $item['end'] ?? '';

        return str_replace(['{operator}', '{start}', '{end}'], [$operator, $start, $end], $mappedValue);
    }

    /**
     * Get order by
     * @param array $sort
     * @return string
     */
    public function getOrderBy(array $sort): string
    {
        return $sort['orderBy'] ?? 'date_entered';
    }

    /**
     * Get sort order
     * @param array $sort
     * @return string
     */
    public function getSortOrder(array $sort): string
    {
        return $sort['sortOrder'] ?? 'DESC';
    }
}
