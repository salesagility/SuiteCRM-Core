<?php

namespace Mock\Core\Legacy\Statistics;


use App\Legacy\Statistics\OpportunitySalesStageTimeSpan;
use Doctrine\ORM\EntityManagerInterface;
use App\Tests\_mock\Helpers\core\legacy\Data\DBQueryResultsMocking;
use Opportunity;
use SugarBean;

class OpportunitySalesStageTimeSpanMock extends OpportunitySalesStageTimeSpan
{
    use DBQueryResultsMocking;

    /**
     * @var Opportunity
     */
    public $opp;

    /**
     * @param Opportunity $opp
     */
    public function setOpportunity(Opportunity $opp): void
    {
        $this->opp = $opp;
    }

    /**
     * @param $id
     * @return Opportunity
     */
    protected function getOpportunity($id): Opportunity
    {
        return $this->opp;
    }

    protected function startLegacyApp(): void
    {
    }

    /**
     * @inheritDoc
     */
    protected function runAuditInfoQuery(
        EntityManagerInterface $em,
        SugarBean $bean,
        string $field,
        array $procedureParams,
        $innerQuery
    ): ?array {
        return $this->getAllMockQueryResults();
    }
}
