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
 * along with this program.  If not, see http://www.gnu.org/licenses.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */


namespace App\Tests\unit\core\src\Service;

use App\Engine\LegacyHandler\AclHandler;
use App\Engine\Service\AclManagerInterface;
use App\ViewDefinitions\Service\ListViewSidebarWidgetDefinitionProvider;
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
                'refreshOn' => 'data-update'
            ]
        ];
        $widgets = $this->service->getSidebarWidgets('leads');
        static::assertNotNull($widgets);
        static::assertSame($expected, $widgets);
    }
}
