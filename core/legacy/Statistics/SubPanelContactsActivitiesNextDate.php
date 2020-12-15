<?php

namespace App\Legacy\Statistics;

use App\Entity\Statistic;
use DateFormatService;


/**
 * Class SubPanelContactsActivitiesNextDate
 * @package App\Legacy\Statistics
 */
class SubPanelContactsActivitiesNextDate extends SubPanelAccountsActivitiesNextDate
{
    use DateTimeStatisticsHandlingTrait;

    public const KEY = 'contacts-activities';

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
        $queries = $this->getQueries($module, $id, $subpanel);


        /* @noinspection PhpIncludeInspection */
        require_once 'include/portability/Services/DateTime/DateFormatService.php';
        $dateFormatService = new DateFormatService();

        $dateNow = date("Y-m-d H:i:s");

        $parts = $queries[1];
        $parts['select'] = 'SELECT tasks.`date_start` AS `tasks_parent_date_start`';
        $tasksWhere = "tasks.`date_start` >= '$dateNow' ";
        if (!empty($parts['where'])) {
            $tasksWhere = " AND " . $tasksWhere;
        }
        $parts['where'] .= $tasksWhere;
        $parts['order_by'] .= ' ORDER BY `tasks_parent_date_start` ASC LIMIT 1';
        $innerQuery = $this->joinQueryParts($parts);
        $tasksParentResult = $this->fetchRow($innerQuery);

        $parts = $queries[2];
        $parts['select'] = 'SELECT meetings.`date_start` AS `meetings_date_start`';
        $meetingsWhere = "  meetings.`date_start` >= ' $dateNow ' ";
        if (!empty($parts['where'])) {
            $meetingsWhere = ' AND ' . $meetingsWhere;
        }
        $parts['where'] .= $meetingsWhere;
        $parts['order_by'] .= ' ORDER BY `meetings_date_start` ASC LIMIT 1';
        $innerQuery = $this->joinQueryParts($parts);
        $meetingsResult = $this->fetchRow($innerQuery);

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
