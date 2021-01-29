<?php

namespace App\Legacy\Statistics;

use App\Entity\Statistic;
use App\Legacy\Data\PresetDataHandlers\SubpanelDataQueryHandler;
use App\Service\StatisticsProviderInterface;


/**
 * Class SubPanelHistoryLastDate
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

        $dateNow = date("Y-m-d");

        $queries = $this->getQueries($module, $id, $subpanel);

        $result = $this->calculateQueryResult($queries, $dateNow, $id);

        $max = $this->calculateSmallestDate(
            $result
        );

        if (empty($max)) {
            $statistic = $this->getEmptyResponse(self::KEY);
            $this->close();

            return $statistic;
        }

        $statistic = $this->buildStatistic($max);
        $this->addMetadata($statistic, ['tooltip_title_key' => 'LBL_HISTORY_LAST_DATE']);
        $this->close();

        return $statistic;
    }

    /**
     * @param string $max
     * @return Statistic
     */
    protected function buildStatistic(string $max): Statistic
    {
        if (!empty($max)) {
            $statistic = $this->buildSingleValueResponse(self::KEY, 'date', ['value' => $max]);
        } else {
            $statistic = $this->getEmptyResponse(self::KEY);
        }

        return $statistic;
    }

    /**
     * @param array $result
     * @return string
     */
    protected function calculateSmallestDate(array $result): string
    {
        foreach ($result as $key => $value) {
            if (!empty($value)) {
                $key = array_key_first($value);
                $date[] = $value[$key];
            }
        }
        if (empty($date)) {
            return '';
        }

        return max($date);
    }

    /**
     * @param $queries
     * @param  $dateNow
     * @param string $id
     * @return array
     */
    protected function calculateQueryResult($queries, $dateNow, string $id): array
    {
        $result = [];
        for ($i = 0; $i <= 3; $i++) {
            if (!isset($queries[$i])) {
                continue;
            }

            $parts = $queries[$i];

            if (!$parts['select']) {
                continue;
            }

            $table = explode(" ", $parts['select']);
            $tableName = explode(".", $table[3]);
            $tableName = $tableName[0];

            if ($tableName === 'emails') {
                $parts['select'] = "SELECT " . $tableName . ".`date_sent_received` AS `" . $tableName . "_date_end`";
                $parts['order_by'] .= " ORDER BY `" . $tableName . "_date_end` DESC LIMIT 1";
                $innerQuery = $this->joinQueryParts($parts);
                $result[$i] = $this->fetchRow($innerQuery);
                continue;
            }

            if ($tableName === 'meetings' || $tableName === 'calls') {
                $parts['select'] = "SELECT " . $tableName . ".`date_end` AS `" . $tableName . "_date_end`";
                $where = "" . $tableName . ".`date_end` <= '$dateNow' AND " . $tableName . ".parent_id = '$id' ";
                if (!empty($parts['where'])) {
                    $where = " AND " . $where;
                }
                $parts['where'] .= $where;
                $parts['order_by'] .= " ORDER BY `" . $tableName . "_date_end` DESC LIMIT 1";
                $innerQuery = $this->joinQueryParts($parts);
                $result[$i] = $this->fetchRow($innerQuery);
            }
        }


        return $result;
    }
}
