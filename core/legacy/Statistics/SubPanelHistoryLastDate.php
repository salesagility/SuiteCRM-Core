<?php

namespace App\Legacy\Statistics;

use App\Entity\Statistic;
use App\Legacy\Data\PresetDataHandlers\SubpanelDataQueryHandler;
use App\Service\StatisticsProviderInterface;
use DateFormatService;

/**
 * Class ContactLastTouchPoint
 * @package App\Legacy\Statistics
 */
class SubPanelHistoryLastDate extends SubpanelDataQueryHandler implements StatisticsProviderInterface
{
    use DateTimeStatisticsHandlingTrait;

    public const KEY = 'history';

    /**
     * @inheritDoc
     */
    public function getKey(): string
    {
        return self::KEY;
    }

    /**
     * @inheritDoc
     * @throws \Exception
     */
    public function getData(array $query): Statistic
    {
        [$module, $id] = $this->extractContext($query);
        $subpanel = 'history';
        if (empty($module) || empty($id)) {
            return $this->getEmptyResponse(self::KEY);
        }

        $this->init();
        $this->startLegacyApp();

        $dateNow = date("Y-m-d");

        /* @noinspection PhpIncludeInspection */
        require_once 'include/portability/Services/DateTime/DateFormatService.php';
        $dateFormatService = new DateFormatService();


        $queries = $this->getQueries($module, $id, $subpanel);
        if ($module === 'accounts' || $module === 'leads') {
            $parts = $queries[1];
        } elseif ($module === 'contacts') {
            $parts = $queries[2];
        } else {
            $parts = $queries[0];
        }
        $parts['select'] = 'SELECT meetings.`date_end` AS `meetings_date_end`';
        $parts['where'] = " WHERE meetings.parent_id = '$id' AND meetings.status = 'Held' AND meetings.date_end <= '$dateNow'";
        $parts['order_by'] .= ' ORDER BY `meetings_date_end` DESC LIMIT 1';
        $innerQuery = $this->joinQueryParts($parts);
        $meetingsResult = $this->fetchRow($innerQuery);

        if ($module === 'accounts' || $module === 'opportunities' || $module === 'cases') {
            $parts = $queries[2];
        } else {
            $parts = $queries[3];
        }
        $parts['select'] = 'SELECT calls.`date_end` ';
        $parts['where'] = " WHERE calls.parent_id = '$id' AND calls.status = 'Held' AND calls.date_end <= '$dateNow'";
        $parts['order_by'] .= ' ORDER BY calls.`date_end` DESC LIMIT 1';
        $innerQuery = $this->joinQueryParts($parts);
        $callsResult = $this->fetchRow($innerQuery);


        if ($module === 'accounts' || $module === 'opportunities' || $module === 'cases') {
            $parts = $queries[4];
        } elseif ($module === 'contacts') {
            $parts = $queries[5];
        } else {
            $parts = $queries[6];
        }
        $parts['select'] = 'SELECT  emails.`date_sent_received` ';
        $parts['order_by'] .= ' ORDER BY  emails.`date_sent_received` DESC LIMIT 1';
        $innerQuery = $this->joinQueryParts($parts);
        $emailsResult1 = $this->fetchRow($innerQuery);

        $date = [];
        $positions = [];
        $i = 0;


        if (!empty($meetingsResult['meetings_date_end'])) {
            $date[$i] = $meetingsResult['meetings_date_end'];
            $positions[$date[$i]] = 'meetings_date_end';
            $i++;
        }
        if (!empty($callsResult['date_end'])) {
            $date[$i] = $callsResult['date_end'];
            $positions[$date[$i]] = 'date_end';
            $i++;
        }
        if (!empty($emailsResult1['date_sent_received'])) {
            $date[$i] = $emailsResult1['date_sent_received'];
            $positions[$date[$i]] = 'date_sent_received';
        }

        if (empty($date)) {
            $statistic = $this->getEmptyResponse(self::KEY);
        } else {
            $max = max($date);

            $date = $dateFormatService->toDBDate($max);

            if ('meetings_date_end' === $positions[$max]) {
                $statistic = $this->buildSingleValueResponse(self::KEY, 'date', ['value' => $date]);
            } elseif ('date_end' === $positions[$max]) {
                $statistic = $this->buildSingleValueResponse(self::KEY, 'date', ['value' => $date]);
            } elseif ('date_sent_received' === $positions[$max]) {
                $statistic = $this->buildSingleValueResponse(self::KEY, 'date', ['value' => $date]);
            } else {
                $statistic = $this->getEmptyResponse(self::KEY);
            }
        }

        $this->close();

        return $statistic;
    }

}
