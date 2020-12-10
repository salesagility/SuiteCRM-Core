<?php

namespace Mock\Core\Legacy\Statistics;

use AcceptanceTester;
use App\Legacy\Statistics\CasesPerAccount;
use App\Tests\_mock\Helpers\core\legacy\Data\DBQueryResultsMocking;
use SugarBean;
use aCase;
use BeanFactory;

class CasesPerAccountMock extends CasesPerAccount
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

    /**
     * @param string $id
     * @return aCase|null
     */
    protected function getCase(string $id): ?aCase
    {
        /** @var aCase $case */
        $case = BeanFactory::getBean('Cases');
        $case->account_id = '12345';

        return $case;
    }
}
