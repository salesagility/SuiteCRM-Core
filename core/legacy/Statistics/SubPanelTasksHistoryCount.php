<?php

namespace App\Legacy\Statistics;

use App\Entity\Statistic;
use App\Legacy\Data\PresetDataHandlers\SubpanelDataQueryHandler;
use App\Service\StatisticsProviderInterface;


/**
 * Class SubPanelTasksHistoryCount
 * @package App\Legacy\Statistics
 */
class SubPanelTasksHistoryCount extends SubpanelDataQueryHandler implements StatisticsProviderInterface
{
    use StatisticsHandlingTrait;

    public const KEY = 'tasks-history';

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
        $subpanel = 'history';
        if (empty($module) || empty($id)) {
            return $this->getEmptyResponse(self::KEY);
        }

        $this->init();
        $this->startLegacyApp();

        $queries = $this->getQueries($module, $id, $subpanel);
        $parts = $queries[0];
        $parts['select'] = 'SELECT  COUNT(*) as value';
        $innerQuery = $this->joinQueryParts($parts);
        $notes = $this->fetchRow($innerQuery);
        $statistic = $this->buildSingleValueResponse(self::KEY, 'int', $notes);

        $this->close();

        return $statistic;
    }

}
