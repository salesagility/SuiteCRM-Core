<?php

namespace App\Legacy\Statistics;

use App\Entity\Statistic;
use App\Service\StatisticsProviderInterface;
use App\Legacy\Data\PresetDataHandlers\SubpanelDataQueryHandler;

class SubpanelOpportunitiesTotal extends SubpanelDataQueryHandler implements StatisticsProviderInterface
{
    use StatisticsHandlingTrait;

    public const KEY = 'opportunities';

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

        $subpanel = 'opportunities';
        [$module, $id] = $this->extractContext($query);

        if (empty($module) || empty($id)) {
            return $this->getEmptyResponse(self::KEY);
        }

        $this->init();
        $this->startLegacyApp();

        $queries = $this->getQueries($module, $id, $subpanel);

        $parts = $queries[0];
        $parts['select'] = 'SELECT SUM(opportunities.amount) as value ';
        $parts['where'] .= ' AND opportunities.amount is not null ';

        $dbQuery = $this->joinQueryParts($parts);

        $result = $this->runQuery($dbQuery);

        $statistic = $this->buildCurrencyResult($result);

        $this->close();

        return $statistic;
    }
}
