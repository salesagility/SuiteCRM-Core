<?php

namespace App\Tests\_mock\Mock\core\legacy\Statistics;

use App\Legacy\Statistics\OpportunitySalesStageTimeSpan;
use App\Tests\_mock\Helpers\core\legacy\Data\DBQueryResultsMocking;
use Doctrine\ORM\EntityManagerInterface;
use Opportunity;
use SugarBean;

/**
 * Class OpportunitySalesStageTimeSpanMock
 * @package Mock\Core\Legacy\Statistics
 */
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

    /**
     * @inheritDoc
     */
    protected function startLegacyApp(string $currentModule = ''): void
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
