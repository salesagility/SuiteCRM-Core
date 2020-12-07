<?php

namespace App\Legacy\Statistics;

use App\Entity\Statistic;
use App\Legacy\Data\PresetDataHandlers\SubpanelDataQueryHandler;
use App\Service\StatisticsProviderInterface;
use DateFormatService;


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
        [$module, $id] = $this->extractContext($query);
        $subpanel = 'activities';

        if (empty($module) || empty($id)) {
            return $this->getEmptyResponse(self::KEY);
        }

        $this->init();
        $this->startLegacyApp();
        $queries = $this->getQueries($module, $id, $subpanel);


        /* @noinspection PhpIncludeInspection */
        require_once 'include/portability/Services/DateTime/DateFormatService.php';
        $dateFormatService = new DateFormatService();

        $dateNow = date("Y-m-d H:i:s");

        if ($module === 'project' || $module === 'cases' || $module === 'opportunities' || $module === 'contacts') {
            $parts = $queries[1];
        } elseif ($module === 'prospects' || $module === 'accounts') {
            $parts = $queries[0];
        } elseif ($module === 'leads') {
            $parts = $queries[2];
        }
        $parts['select'] = 'SELECT tasks.`date_start` AS `tasks_parent_date_start`';
        $tasksWhere = "tasks.`date_start` >= '$dateNow' ";
        if (!empty($parts['where'])) {
            $tasksWhere = " AND " . $tasksWhere;
        }
        $parts['where'] .= $tasksWhere;
        $parts['order_by'] .= ' ORDER BY `tasks_parent_date_start` ASC LIMIT 1';
        $innerQuery = $this->joinQueryParts($parts);
        $tasksParentResult = $this->fetchRow($innerQuery);

        if ($module === 'contacts') {
            $parts = $queries[0];
            $parts['select'] = 'SELECT tasks.`date_start` AS `tasks_date_start`';
            $tasksWhere = "tasks.`date_start` >= '$dateNow' ";
            if (!empty($parts['where'])) {
                $tasksWhere = " AND " . $tasksWhere;
            }
            $parts['where'] .= $tasksWhere;
            $parts['order_by'] .= ' ORDER BY `tasks_date_start` ASC LIMIT 1';
            $innerQuery = $this->joinQueryParts($parts);
            $tasksResult = $this->fetchRow($innerQuery);
        }


        if ($module === 'project' || $module === 'cases' || $module === 'opportunities') {
            $parts = $queries[0];
        } elseif ($module === 'prospects' || $module === 'accounts' || $module === 'leads') {
            $parts = $queries[1];
        } elseif ($module === 'contacts') {
            $parts = $queries[2];
        }
        $parts['select'] = 'SELECT meetings.`date_start` AS `meetings_date_start`';
        $meetingsWhere = "  meetings.`date_start` >= ' $dateNow ' ";
        if (!empty($parts['where'])) {
            $meetingsWhere = ' AND ' . $meetingsWhere;
        }
        $parts['where'] .= $meetingsWhere;
        $parts['order_by'] .= ' ORDER BY `meetings_date_start` ASC LIMIT 1';
        $innerQuery = $this->joinQueryParts($parts);
        $meetingsResult = $this->fetchRow($innerQuery);

        if ($module === 'project' || $module === 'cases' || $module === 'opportunities' || $module === 'prospects' || $module === 'accounts') {
            $parts = $queries[2];
        } else {
            $parts = $queries[3];
        }
        $parts['select'] = 'SELECT calls.`date_start` AS `calls_date_start` ';
        $callsWhere = " calls.`date_start` >= ' $dateNow ' ";
        if (!empty($parts['where'])) {
            $callsWhere = ' AND ' . $callsWhere;
        }
        $parts['where'] .= $callsWhere;
        $parts['order_by'] .= ' ORDER BY `calls_date_start` ASC LIMIT 1';
        $innerQuery = $this->joinQueryParts($parts);
        $callsResult = $this->fetchRow($innerQuery);

        $date = [];
        $positions = [];
        $i = 0;

        if (!empty($meetingsResult['meetings_date_start'])) {
            $date[$i] = $meetingsResult['meetings_date_start'];
            $positions[$date[$i]] = 'meetings_date_start';
            $i++;
        }
        if (!empty($callsResult['calls_date_start'])) {
            $date[$i] = $callsResult['calls_date_start'];
            $positions[$date[$i]] = 'calls_date_start';
            $i++;
        }
        if (!empty($tasksParentResult['tasks_parent_date_start'])) {
            $date[$i] = $tasksParentResult['tasks_parent_date_start'];
            $positions[$date[$i]] = 'tasks_parent_date_start';
            $i++;
        }
        if (!empty($tasksResult['tasks_date_start'])) {
            $date[$i] = $tasksResult['tasks_date_start'];
            $positions[$date[$i]] = 'tasks_date_start';
        }

        if (empty($date)) {
            $statistic = $this->getEmptyResponse(self::KEY);
            $this->close();

            return $statistic;
        }

        $min = min($date);

        if ('meetings_date_start' === $positions[$min]) {
            $statistic = $this->buildSingleValueResponse(self::KEY, 'date', ['value' => $min]);
        } elseif ('calls_date_start' === $positions[$min]) {
            $statistic = $this->buildSingleValueResponse(self::KEY, 'date', ['value' => $min]);
        } elseif ('tasks_date_start' === $positions[$min]) {
            $statistic = $this->buildSingleValueResponse(self::KEY, 'date', ['value' => $min]);
        } elseif ('tasks_parent_date_start' === $positions[$min]) {
            $statistic = $this->buildSingleValueResponse(self::KEY, 'date', ['value' => $min]);
        } else {
            $statistic = $this->buildSingleValueResponse(self::KEY, 'varchar', ['value' => '-']);
        }
        $this->close();

        return $statistic;
    }
}
