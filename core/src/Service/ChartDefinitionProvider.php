<?php

namespace App\Service;

/**
 * Class ChartDefinitionProvider
 * @package App\Service
 */
class ChartDefinitionProvider implements ChartDefinitionProviderInterface
{
    /**
     * @var array
     */
    private $listViewAvailableCharts;

    /**
     * ChartDefinitionProvider constructor.
     * @param array $listViewAvailableCharts
     */
    public function __construct(array $listViewAvailableCharts)
    {
        $this->listViewAvailableCharts = $listViewAvailableCharts;
    }


    /**
     * @param string $module
     * @return array
     */
    public function getCharts(string $module): array
    {
        return $this->listViewAvailableCharts['modules'][$module] ?? [];
    }
}
