<?php

namespace SuiteCRM\Core\Legacy\Statistics;

use App\Entity\Statistic;
use App\Service\StatisticsProviderInterface;
use SuiteCRM\Core\Legacy\Data\PresetDataHandlers\SubpanelDataQueryHandler;

class WonOpportunityAmountByYear extends SubpanelDataQueryHandler implements StatisticsProviderInterface
{
    use StatisticsHandlingTrait;

    public const KEY = 'accounts-won-opportunity-amount-by-year';

    /**
     * @inheritDoc
     */
    public function getKey(): string
    {
        return self::KEY;
    }

    /**
     * @inheritDoc
     */
    public function getData(array $query): Statistic
    {
        [$module, $id] = $this->extractContext($query);
        $subpanel = 'opportunities';

        if (empty($module) || empty($id)) {
            return $this->getEmptyResponse(self::KEY);
        }

        $this->init();
        $this->startLegacyApp();

        $queries = $this->getQueries($module, $id, $subpanel);

        $parts = $queries[0];
        $parts['select'] = 'SELECT SUM(opportunities.amount) as amount_by_year ';
        $parts['where'] .= ' AND opportunities.date_closed is not null ';
        $parts['where'] .= " AND opportunities.sales_stage = 'Closed Won' ";
        $parts['group_by'] = ' GROUP BY EXTRACT(YEAR FROM opportunities.date_closed) ';

        $innerQuery = $this->joinQueryParts($parts);

        $dbQuery = 'SELECT AVG(opp_data.amount_by_year) as value FROM ( ' . $innerQuery . ' ) as opp_data';

        $result = $this->runQuery($dbQuery);

        $statistic = $this->buildCurrencyResult($result);

        $this->close();

        return $statistic;
    }
}
