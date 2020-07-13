<?php

namespace App\Service;

/**
 * Interface ChartDefinitionProviderInterface
 * @package App\Service
 */
interface ChartDefinitionProviderInterface
{

    /**
     * Get list of charts for module
     * @param string $module
     * @return array
     */
    public function getCharts(string $module): array;
}
