<?php

namespace App\Legacy\Statistics;

use App\Entity\Statistic;
use App\Legacy\Data\PresetDataHandlers\SubpanelDataQueryHandler;
use App\Service\StatisticsProviderInterface;
use Elasticsearch\Endpoints\Indices\Refresh;


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


        $parts = $queries[0]; //tasks
        $parts['select'] = 'SELECT tasks.`date_start` AS `tasks_date_start`';
        $parts['order_by'] .= ' ORDER BY `tasks_date_start` ASC LIMIT 1';
        $innerQuery = $this->joinQueryParts($parts);
        $tasksResult = $this->fetchRow($innerQuery);



        $parts = $queries[1]; //meetings
        $parts['select'] = 'SELECT meetings.`date_start` AS `meetings_date_start`';
        $parts['order_by'] .= ' ORDER BY `meetings_date_start` ASC LIMIT 1';
        $innerQuery = $this->joinQueryParts($parts);
        $meetingsResult = $this->fetchRow($innerQuery);


        $parts = $queries[2]; //calls
        $parts['select'] = 'SELECT calls.`date_start` AS `calls_date_start` ';
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
        if (!empty($tasksResult['tasks_date_start'])) {
            $date[$i] = $tasksResult['tasks_date_start'];
            $positions[$date[$i]] = 'tasks_date_start';
        }

        $min = min($date);
        $date_now = date("Y-m-d H:i:s");

        for ($x = 0; $x <= 2; $x++){
            if ($min < $date_now){
                asort($date);
                $min = $date[$x];
            }
        }


        if ('meetings_date_start' === $positions[$min]) {
            $statistic = $this->buildSingleValueResponse(self::KEY, 'datetime', ['value' => $min]);
        } elseif ('calls_date_start' === $positions[$min]) {
            $statistic = $this->buildSingleValueResponse(self::KEY, 'datetime', ['value' => $min]);
        } elseif ('tasks_date_start' === $positions[$min]) {
            $statistic = $this->buildSingleValueResponse(self::KEY, 'datetime', ['value' => $min]);
        }else {
            $statistic = $this->buildSingleValueResponse(self::KEY, 'varchar', ['value' => '-']);
        }
        $this->close();

        return $statistic;
    }
}
