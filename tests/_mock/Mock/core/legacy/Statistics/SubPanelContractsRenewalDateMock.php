<?php

namespace App\Tests\_mock\Mock\core\legacy\Statistics;

use App\Module\Contracts\Statistics\Subpanels\SubPanelContractsRenewalDate;
use App\Tests\_mock\Helpers\core\legacy\Data\DBQueryResultsMocking;

/**
 * Class SubPanelContractsRenewalDateMock
 * @package Mock\Core\Legacy\Statistics
 */
class SubPanelContractsRenewalDateMock extends SubPanelContractsRenewalDate
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
                'where' => '',
                'order_by' => '',
            ],

        ];
    }

    /**
     * @inheritDoc
     */
    public function fetchRow(string $query): array
    {
        return $this->getMockQueryResults();
    }

    /**
     * @inheritDoc
     */
    protected function startLegacyApp(string $currentModule = ''): void
    {
    }
}
