<?php

namespace Mock\Core\Legacy\Statistics;

use App\Legacy\Statistics\WonOpportunityAmountByYear;
use Mock\Helpers\Core\Legacy\Data\DBQueryResultsMocking;

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
    public function runQuery(string $query): array
    {
        return $this->getMockQueryResults();
    }

    protected function startLegacyApp(): void
    {
    }
}
