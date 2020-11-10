<?php

namespace App\Tests\unit\core\src\Service;

use App\Service\ChartDefinitionProvider;
use App\Tests\UnitTester;
use Codeception\Test\Unit;
use Exception;

/**
 * Class ChartDefinitionProviderTest
 * @package App\Tests
 */
class ChartDefinitionProviderTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var ChartDefinitionProvider
     */
    protected $service;

    /**
     * @throws Exception
     */
    protected function _before(): void
    {
        $listViewAvailableCharts = [
            'modules' => [
                'Accounts' => [
                    'key' => 'annual_revenue',
                    'labelKey' => 'ANNUAL_REVENUE_BY_ACCOUNTS',
                    'type' => 'line',
                ],
                'Opportunities' => [
                    'key' => 'pipeline_by_sales_state',
                    'labelKey' => 'PIPELINE_BY_SALES_STAGE',
                    'type' => 'bar',
                ],
                'Leads' => [
                    'key' => 'leads_by_source',
                    'labelKey' => 'LEADS_BY_SOURCE',
                    'type' => 'line',
                ]
            ]
        ];

        $this->service = new ChartDefinitionProvider($listViewAvailableCharts);
    }

    public function testDefaultActionsRetrieval(): void
    {
        $actions = $this->service->getCharts('accounts');
        static::assertNotNull($actions);
    }
}
