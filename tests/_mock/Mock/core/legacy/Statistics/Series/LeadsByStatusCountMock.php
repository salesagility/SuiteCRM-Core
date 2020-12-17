<?php

namespace App\Tests\_mock\Mock\core\legacy\Statistics\Series;

use App\Legacy\Statistics\Series\LeadsByStatusCount;
use App\Tests\_mock\Helpers\core\legacy\Data\DBQueryResultsMocking;
use SugarBean;

/**
 * Class LeadsByStatusCountMock
 * @package Mock\Core\Legacy\Statistics\Series
 */
class LeadsByStatusCountMock extends LeadsByStatusCount
{
    use DBQueryResultsMocking;

    /**
     * @var SugarBean
     */
    public $bean;

    /**
     * @inheritDoc
     */
    protected function getBean(string $legacyName)
    {
        return $this->bean;
    }

    /**
     * @param SugarBean $bean
     */
    public function setBean(SugarBean $bean): void
    {
        $this->bean = $bean;
    }

    protected function startLegacyApp(): void
    {
    }

    /**
     * @inheritDoc
     */
    protected function runQuery(array $query, $bean): array
    {
        return $this->getAllMockQueryResults();
    }
}
