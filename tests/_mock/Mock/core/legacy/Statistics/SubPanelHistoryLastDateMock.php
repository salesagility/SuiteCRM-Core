<?php

namespace App\Tests\_mock\Mock\core\legacy\Statistics;

use App\Legacy\Statistics\SubPanelHistoryLastDate;
use App\Tests\_mock\Helpers\core\legacy\Data\DBQueryResultsMocking;

/**
 * Class SubPanelHistoryLastDateMock
 * @package App\Tests\_mock\Mock\core\legacy\Statistics
 */
class SubPanelHistoryLastDateMock extends SubPanelHistoryLastDate
{
    use DBQueryResultsMocking;


    /**
     * @inheritDoc
     */
    public function getQueries(string $parentModule, string $parentId, string $subpanel): array
    {
        return [
            [
                'select' => '',
                'order_by' => '',
            ],
            [
                'select' => '',
                'order_by' => '',
            ],
            [
                'select' => '',
                'order_by' => '',
            ],
            [
                'select' => '',
                'order_by' => '',
            ],
            [
                'select' => '',
                'order_by' => '',
            ]
        ];
    }

    /**
     * @inheritDoc
     */
    public function fetchRow(string $query): array
    {
        return $this->getMockQueryResults();
    }

    protected function startLegacyApp(): void
    {
    }
}
