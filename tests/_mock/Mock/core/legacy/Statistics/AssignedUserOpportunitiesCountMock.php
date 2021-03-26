<?php

namespace Mock\Core\Legacy\Statistics;

use App\Module\Users\Statistics\AssignedUserOpportunitiesCount;
use App\Tests\_mock\Helpers\core\legacy\Data\DBQueryResultsMocking;
use BeanFactory;
use Opportunity;
use SugarBean;

class AssignedUserOpportunitiesCountMock extends AssignedUserOpportunitiesCount
{
    use DBQueryResultsMocking;

    /**
     * @inheritDoc
     */
    protected function runQuery(SugarBean $bean, string $id, array $statuses): array
    {
        return $this->getMockQueryResults();
    }

    /**
     * @inheritDoc
     */
    protected function startLegacyApp(string $currentModule = ''): void
    {
    }

    /**
     * @inheritDoc
     */
    protected function getQuerySalesStages(?Opportunity $bean): array
    {
        return [];
    }

    /**
     * @inheritDoc
     */
    protected function getOpportunity($id): ?Opportunity
    {
        /** @var Opportunity $bean */
        $bean = BeanFactory::newBean('Opportunities');

        return $bean;
    }
}
