<?php

namespace Mock\Core\Legacy\Statistics;

use App\Legacy\Statistics\SubpanelOpportunitiesTotal;
use App\Tests\_mock\Helpers\core\legacy\Data\DBQueryResultsMocking;

class SubpanelOpportunitiesTotalMock extends SubpanelOpportunitiesTotal
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
