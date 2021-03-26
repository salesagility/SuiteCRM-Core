<?php

namespace App\Tests\_mock\Mock\core\legacy\Statistics;

use App\Module\Opportunities\Statistics\WonOpportunityAmountByYear;
use App\Tests\_mock\Helpers\core\legacy\Data\DBQueryResultsMocking;

/**
 * Class WonOpportunityAmountByYearMock
 * @package App\Tests\_mock\Mock\core\legacy\Statistics
 */
class WonOpportunityAmountByYearMock extends WonOpportunityAmountByYear
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

    /**
     * @inheritDoc
     */
    protected function startLegacyApp(string $currentModule = ''): void
    {
    }
}
