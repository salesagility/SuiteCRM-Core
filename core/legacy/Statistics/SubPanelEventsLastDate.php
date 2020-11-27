<?php

namespace App\Legacy\Statistics;

use App\Entity\Statistic;
use App\Legacy\Data\PresetDataHandlers\SubpanelDataQueryHandler;
use App\Service\StatisticsProviderInterface;

/**
 * Class SubPanelEventsLastDate
 * @package App\Legacy\Statistics
 */
class SubPanelEventsLastDate extends SubpanelDataQueryHandler implements StatisticsProviderInterface
{
    use DateTimeStatisticsHandlingTrait;

    public const KEY = 'events';

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

        if (empty($module) || empty($id)) {
            return $this->getEmptyResponse(self::KEY);
        }

        $this->init();
        $this->startLegacyApp();

        $dateNow = date("Y-m-d");
        $eventsWhere = " fp_events.`date_end` <= ' $dateNow ' ";

        if ($module === 'leads') {
            $subpanel = 'fp_events_leads_1';
            $queries = $this->getQueries($module, $id, $subpanel);
            $parts = $queries[0];
            $parts['select'] = 'SELECT fp_events.`date_end` AS `leads_date_end`';
            if (!empty($parts['where'])) {
                $eventsWhere = " AND " . $eventsWhere;
            }
            $parts['where'] .= $eventsWhere;
            $parts['order_by'] .= ' ORDER BY `leads_date_end` DESC LIMIT 1';
            $innerQuery = $this->joinQueryParts($parts);
            $leads = $this->fetchRow($innerQuery);
        } elseif ($module === 'contacts') {
            $subpanel = 'fp_events_contacts';
            $queries = $this->getQueries($module, $id, $subpanel);
            $parts = $queries[0];
            $parts['select'] = 'SELECT fp_events.`date_end` AS `contacts_date_end`';
            if (!empty($parts['where'])) {
                $eventsWhere = " AND " . $eventsWhere;
            }
            $parts['where'] .= $eventsWhere;
            $parts['order_by'] .= ' ORDER BY `contacts_date_end` DESC LIMIT 1';
            $innerQuery = $this->joinQueryParts($parts);
            $contacts = $this->fetchRow($innerQuery);
        } else {
            $subpanel = 'fp_events_prospects_1';
            $queries = $this->getQueries($module, $id, $subpanel);
            $parts = $queries[0];
            $parts['select'] = 'SELECT fp_events.`date_end`';
            if (!empty($parts['where'])) {
                $eventsWhere = " AND " . $eventsWhere;
            }
            $parts['where'] .= $eventsWhere;
            $parts['order_by'] .= ' ORDER BY `date_end` DESC LIMIT 1';
            $innerQuery = $this->joinQueryParts($parts);
            $other = $this->fetchRow($innerQuery);
        }


        $date = [];
        $positions = [];
        $i = 0;

        if (!empty($leads['leads_date_end'])) {
            $date[$i] = $leads['leads_date_end'];
            $positions[$date[$i]] = 'leads_date_end';
        }
        if (!empty($contacts['contacts_date_end'])) {
            $date[$i] = $contacts['contacts_date_end'];
            $positions[$date[$i]] = 'contacts_date_end';
        }
        if (!empty($other['date_end'])) {
            $date[$i] = $other['date_end'];
            $positions[$date[$i]] = 'date_end';
        }

        if (empty($date)) {
            $statistic = $this->getEmptyResponse(self::KEY);
            $this->close();

            return $statistic;
        }

        $dateValue = $date[0];

        if ('leads_date_end' === $positions[$dateValue]) {
            $statistic = $this->buildSingleValueResponse(self::KEY, 'datetime', ['value' => $dateValue]);
        } elseif ('contacts_date_end' === $positions[$dateValue]) {
            $statistic = $this->buildSingleValueResponse(self::KEY, 'datetime', ['value' => $dateValue]);
        } elseif ('date_end' === $positions[$dateValue]) {
            $statistic = $this->buildSingleValueResponse(self::KEY, 'datetime', ['value' => $dateValue]);
        } else {
            $statistic = $this->getEmptyResponse(self::KEY);
        }
        $this->close();


        return $statistic;
    }
}
