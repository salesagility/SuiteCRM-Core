<?php

namespace App\Module\Activities\Statistics\Subpanels;

use App\Statistics\DateTimeStatisticsHandlingTrait;
use App\Statistics\Entity\Statistic;
use App\Data\LegacyHandler\PresetDataHandlers\SubpanelDataQueryHandler;
use App\Service\StatisticsProviderInterface;


/**
 * Class SubPanelActivitiesNextDate
 * @package App\Legacy\Statistics
 */
class SubPanelActivitiesNextDate extends SubpanelDataQueryHandler implements StatisticsProviderInterface
{
    use DateTimeStatisticsHandlingTrait;

    public const KEY = 'activities';

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

        $result = $this->calculateQueryResult($queries, $dateNow);

        $min = $this->calculateSmallestDate(
            $result
        );

        if (empty($min)) {
            $statistic = $this->getEmptyResponse(self::KEY);
            $this->close();
            $this->addMetadata($statistic, ['tooltip_title_key' => 'LBL_ACTIVITIES_NEXT_DATE_TOOLTIP']);
            $this->addMetadata($statistic, ['descriptionKey' => 'LBL_ACTIVITIES_NEXT_DATE']);

            return $statistic;
        }

        $statistic = $this->buildStatistic($min);
        $this->addMetadata($statistic, ['tooltip_title_key' => 'LBL_ACTIVITIES_NEXT_DATE_TOOLTIP']);
        $this->addMetadata($statistic, ['descriptionKey' => 'LBL_ACTIVITIES_NEXT_DATE']);
        $this->close();

        return $statistic;
    }

    /**
     * @param string $min
     * @return Statistic
     */
    protected function buildStatistic(string $min): Statistic
    {
        if (!empty($min)) {
            $statistic = $this->buildSingleValueResponse(self::KEY, 'date', ['value' => $min]);
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

        return min($date);
    }

    /**
     * @param $queries
     * @param  $dateNow
     * @return array
     */
    protected function calculateQueryResult($queries, $dateNow): array
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

            $parts['select'] = "SELECT " . $tableName . ".`date_start` AS `" . $tableName . "_date_start`";
            $where = "" . $tableName . ".`date_start` >= '$dateNow' ";
            if (!empty($parts['where'])) {
                $where = " AND " . $where;
            }
            $parts['where'] .= $where;
            $parts['order_by'] .= " ORDER BY `" . $tableName . "_date_start` ASC LIMIT 1";
            $innerQuery = $this->joinQueryParts($parts);
            $result[$i] = $this->fetchRow($innerQuery);
        }


        return $result;
    }
}
