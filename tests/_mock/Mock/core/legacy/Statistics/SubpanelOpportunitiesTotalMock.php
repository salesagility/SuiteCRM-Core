<?php

namespace App\Tests\_mock\Mock\core\legacy\Statistics;

use App\Module\Opportunities\Statistics\Subpanels\SubpanelOpportunitiesTotal;
use App\Tests\_mock\Helpers\core\legacy\Data\DBQueryResultsMocking;

/**
 * Class SubpanelOpportunitiesTotalMock
 * @package Mock\Core\Legacy\Statistics
 */
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
