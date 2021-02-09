<?php

namespace App\Legacy\Statistics;

use App\Entity\Statistic;
use App\Service\StatisticsProviderInterface;
use App\Legacy\Data\PresetDataHandlers\SubpanelDataQueryHandler;

/**
 * Class SubPanelContractsRenewalDate
 * @package App\Legacy\Statistics
 */
class SubPanelContractsRenewalDate extends SubpanelDataQueryHandler implements StatisticsProviderInterface
{
    use StatisticsHandlingTrait;

    public const KEY = 'contracts';

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
        $subpanel = $query['key'];

        [$module, $id] = $this->extractContext($query);
        if (empty($module) || empty($id)) {
            return $this->getEmptyResponse(self::KEY);
        }

        $subpanelName = $query['params']['subpanel'] ?? '';
        if (!empty($subpanelName)) {
            $subpanel = $subpanelName;
        }

        $this->init();
        $this->startLegacyApp();
        $dateNow = date("Y-m-d");
        $contractsWhere = " aos_contracts.`end_date` >= '$dateNow' ";

        $queries = $this->getQueries($module, $id, $subpanel);
        $parts = $queries[0];
        $parts['select'] = 'SELECT aos_contracts.`end_date`';
        if (!empty($parts['where'])) {
            $contractsWhere = " AND " . $contractsWhere;
        }
        $parts['where'] .= $contractsWhere;
        $parts['order_by'] .= 'ORDER BY aos_contracts.`end_date` ASC LIMIT 1';
        $dbQuery = $this->joinQueryParts($parts);
        $result = $this->fetchRow($dbQuery);

        if (empty($result)) {
            $statistic = $this->getEmptyResponse(self::KEY);
            $this->close();
            $this->addMetadata($statistic, ['tooltip_title_key' => 'LBL_CONTRACT_RENEWAL']);
            return $statistic;
        }

        $statistic = $this->buildSingleValueResponse(self::KEY, 'date', ['value' => $result['end_date']]);
        $this->addMetadata($statistic, ['tooltip_title_key' => 'LBL_CONTRACT_RENEWAL']);
        $this->close();

        return $statistic;
    }
}
