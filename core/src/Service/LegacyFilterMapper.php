<?php

namespace App\Service;

class LegacyFilterMapper
{
    /**
     * @var array
     */
    private $filterOperatorMap;

    /**
     * LegacyFilterMapper constructor.
     * @param array $filterOperatorMap
     */
    public function __construct(array $filterOperatorMap)
    {
        $this->filterOperatorMap = $filterOperatorMap;
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
        if ($mappedValue === 'values') {

            if (count($item['values']) === 1) {
                $legacyValue = $item['values'][0];
            } else {
                $legacyValue = $item['values'];
            }

            return $legacyValue;
        }

        $operator = $item['operator'] ?? '';
        $start = $item['start'] ?? '';
        $end = $item['end'] ?? '';

        return str_replace(['{operator}', '{start}', '{end}'], [$operator, $start, $end], $mappedValue);
    }
}
