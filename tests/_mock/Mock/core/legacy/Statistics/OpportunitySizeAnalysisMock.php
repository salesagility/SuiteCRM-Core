<?php

namespace Mock\Core\Legacy\Statistics;

use App\Legacy\Statistics\OpportunitySizeAnalysis;
use App\Tests\_mock\Helpers\core\legacy\Data\DBQueryResultsMocking;
use BeanFactory;
use Opportunity;
use SugarBean;

class OpportunitySizeAnalysisMock extends OpportunitySizeAnalysis
{
    use DBQueryResultsMocking;

    /**
     * @inheritDoc
     */
    public function runQuery(SugarBean $bean, string $id, array $statuses): array
    {
        return $this->getMockQueryResults();
    }

    protected function startLegacyApp(): void
    {
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
