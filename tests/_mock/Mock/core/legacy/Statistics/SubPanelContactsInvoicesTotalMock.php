<?php

namespace App\Tests\_mock\Mock\core\legacy\Statistics;

use App\Legacy\Statistics\SubPanelContactsInvoicesTotal;
use App\Tests\_mock\Helpers\core\legacy\Data\DBQueryResultsMocking;

/**
 * Class SubPanelCasesCountMock
 * @package Mock\Core\Legacy\Statistics
 */
class SubPanelContactsInvoicesTotalMock extends SubPanelContactsInvoicesTotal
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

    protected function startLegacyApp(): void
    {
    }
}
