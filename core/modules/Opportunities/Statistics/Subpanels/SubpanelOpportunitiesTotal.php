<?php

namespace App\Module\Opportunities\Statistics\Subpanels;

use App\Statistics\Entity\Statistic;
use App\Data\LegacyHandler\PresetDataHandlers\SubpanelDataQueryHandler;
use App\Service\StatisticsProviderInterface;
use App\Statistics\StatisticsHandlingTrait;

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

        $result = $this->fetchRow($dbQuery);

        $statistic = $this->buildCurrencyResult($result);
        $this->addMetadata($statistic, ['tooltip_title_key' => 'LBL_OPPORTUNITIES_TOTAL_SUM_TOOLTIP']);
        $this->addMetadata($statistic, ['descriptionKey' => 'LBL_OPPORTUNITIES_TOTAL_SUM']);
        $this->close();

        return $statistic;
    }
}
