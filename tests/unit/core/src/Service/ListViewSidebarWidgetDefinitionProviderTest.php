<?php

namespace App\Tests\unit\core\src\Service;

use App\Legacy\AclHandler;
use App\Service\AclManagerInterface;
use App\Service\ListViewSidebarWidgetDefinitionProvider;
use App\Tests\UnitTester;
use Codeception\Test\Unit;
use Exception;

/**
 * Class ListViewSidebarWidgetDefinitionProviderTest
 * @package App\Tests
 */
class ListViewSidebarWidgetDefinitionProviderTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var ListViewSidebarWidgetDefinitionProvider
     */
    protected $service;

    /**
     * @throws Exception
     */
    protected function _before(): void
    {
        $listViewAvailableCharts = [
            'default' => [
                'widgets' => []
            ],
            'modules' => [
                'leads' => [
                    'widgets' => [
                        'leads-by-status' => [
                            'type' => 'chart',
                            'labelKey' => 'LBL_QUICK_CHARTS',
                            'options' => [
                                'toggle' => true,
                                'headerTitle' => false,
                                'charts' => [
                                    [
                                        'chartKey' => 'leads-by-status-count',
                                        'chartType' => 'pie-grid',
                                        'statisticsType' => 'leads-by-status-count',
                                        'labelKey' => 'LEADS_BY_STATUS',
                                        'chartOptions' => [
                                            'label' => 'LBL_TOTAL',
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ];

        /** @var AclManagerInterface $aclManager */
        $aclManager = $this->make(
            AclHandler::class,
            [
                'checkAccess' => static function (
                    /** @noinspection PhpUnusedParameterInspection */
                    string $module,
                    string $action,
                    bool $isOwner = false
                ): bool {
                    return true;
                }
            ]
        );

        $this->service = new ListViewSidebarWidgetDefinitionProvider($listViewAvailableCharts, $aclManager);
    }

    public function testWidgetRetrieval(): void
    {
        $expected = [
            [
                'type' => 'chart',
                'labelKey' => 'LBL_QUICK_CHARTS',
                'options' => [
                    'toggle' => true,
                    'headerTitle' => false,
                    'charts' => [
                        [
                            'chartKey' => 'leads-by-status-count',
                            'chartType' => 'pie-grid',
                            'statisticsType' => 'leads-by-status-count',
                            'labelKey' => 'LEADS_BY_STATUS',
                            'chartOptions' => [
                                'label' => 'LBL_TOTAL',
                            ],
                        ]
                    ],
                ],
                'refreshOnRecordUpdate' => true
            ]
        ];
        $widgets = $this->service->getSidebarWidgets('leads');
        static::assertNotNull($widgets);
        static::assertSame($expected, $widgets);
    }
}
