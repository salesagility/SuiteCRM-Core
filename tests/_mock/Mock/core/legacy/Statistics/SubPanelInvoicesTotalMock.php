<?php

namespace App\Tests\_mock\Mock\core\legacy\Statistics;

use App\Module\Invoices\Statistics\Subpanels\SubPanelInvoicesTotal;
use App\Tests\_mock\Helpers\core\legacy\Data\DBQueryResultsMocking;

/**
 * Class SubPanelInvoicesTotalMock
 * @package Mock\Core\Legacy\Statistics
 */
class SubPanelInvoicesTotalMock extends SubPanelInvoicesTotal
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
