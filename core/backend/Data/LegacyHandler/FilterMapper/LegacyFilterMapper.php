<?php
/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2021 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */


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
