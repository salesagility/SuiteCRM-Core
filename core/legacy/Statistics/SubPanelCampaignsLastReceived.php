<?php

namespace App\Legacy\Statistics;

use App\Entity\Statistic;
use App\Legacy\Data\PresetDataHandlers\SubpanelDataQueryHandler;
use App\Service\StatisticsProviderInterface;
use DateFormatService;

/**
 * Class SubPanelCampaignsLastReceived
 * @package App\Legacy\Statistics
 */
class SubPanelCampaignsLastReceived extends SubpanelDataQueryHandler implements StatisticsProviderInterface
{
    use DateTimeStatisticsHandlingTrait;

    public const KEY = 'campaign-log';

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
        if (empty($module) || empty($id) || empty($subpanel)) {
            return $this->getEmptyResponse(self::KEY);
        }

        $subpanelName = $query['params']['subpanel'] ?? '';
        if (!empty($subpanelName)) {
            $subpanel = $subpanelName;
        }

        $this->init();
        $this->startLegacyApp();

        /* @noinspection PhpIncludeInspection */
        require_once 'include/portability/Services/DateTime/DateFormatService.php';
        $dateFormatService = new DateFormatService();
        $dateNow = date("Y-m-d");
        $campaignsWhere = "campaign_log.activity_date <= '$dateNow'";

        $queries = $this->getQueries($module, $id, $subpanel);
        $parts = $queries[0];
        $parts['select'] = ' SELECT campaign_log.`activity_date` AS `last_received` ';
        if (!empty($parts['where'])) {
            $campaignsWhere = " AND " . $campaignsWhere;
        }
        $parts['where'] .= $campaignsWhere;
        $parts['order_by'] .= 'ORDER BY `last_received` DESC LIMIT 1';
        $innerQuery = $this->joinQueryParts($parts);
        $result = $this->fetchRow($innerQuery);

        if (empty($result)) {
            $statistic = $this->getEmptyResponse(self::KEY);
            $this->close();
            return $statistic;
        }
        $result = $result['last_received'];
        $finalDate = $dateFormatService->toDBDate($result);
        $statistic = $this->buildSingleValueResponse(self::KEY, 'date', ['value' => $finalDate]);

        $this->addMetadata($statistic, ['tooltip_title_key' => 'LBL_CAMPAIGN_LAST_RECEIVED']);
        $this->close();


        return $statistic;
    }
}
