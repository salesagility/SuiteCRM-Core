<?php

namespace App\Tests\_mock\Mock\core\legacy\Statistics;

use App\Module\Leads\Statistics\LeadDaysOpen;
use App\Tests\_mock\Helpers\core\legacy\Data\DBQueryResultsMocking;
use Doctrine\ORM\EntityManagerInterface;
use Lead;
use SugarBean;

/**
 * Class LeadDaysOpenMock
 * @package App\Tests\_mock\Mock\core\legacy\Statistics
 */
class LeadDaysOpenMock extends LeadDaysOpen
{
    use DBQueryResultsMocking;

    /**
     * @var Lead
     */
    public $lead;

    /**
     * @param Lead $lead
     */
    public function setLead(Lead $lead): void
    {
        $this->lead = $lead;
    }

    /**
     * @param $id
     * @return Lead
     */
    protected function getLead(string $id): Lead
    {
        return $this->lead;
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
