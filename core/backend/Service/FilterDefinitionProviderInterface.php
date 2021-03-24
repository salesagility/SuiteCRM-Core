<?php

namespace App\Service;

/**
 * Interface FilterDefinitionProviderInterface
 * @package App\Service
 */
interface FilterDefinitionProviderInterface
{

    /**
     * Get list of filters for module
     * @param string $module
     * @return array
     */
    public function getFilters(string $module): array;
}
