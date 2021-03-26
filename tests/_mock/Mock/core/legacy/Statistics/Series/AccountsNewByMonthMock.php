<?php

namespace App\Tests\_mock\Mock\core\legacy\Statistics\Series;

use App\Module\Accounts\Statistics\Series\AccountsNewByMonth;
use App\Tests\_mock\Helpers\core\legacy\Data\DBQueryResultsMocking;
use SugarBean;

/**
 * Class AccountsNewByMonthMock
 * @package Mock\Core\Legacy\Statistics\Series
 */
class AccountsNewByMonthMock extends AccountsNewByMonth
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

    /**
     * @inheritDoc
     */
    protected function startLegacyApp(string $currentModule = ''): void
    {
    }

    /**
     * @inheritDoc
     */
    protected function runQuery(array $query, $bean): array
    {
        return $this->getAllMockQueryResults();
    }

    /**
     * @inheritDoc
     */
    protected function generateQuery(array $query): array
    {
        return [
            'where'
        ];
    }
}
