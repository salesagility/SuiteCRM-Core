<?php

namespace SuiteCRM\Core\Legacy\Statistics;

use App\Entity\Statistic;
use App\Service\StatisticsProviderInterface;

class SubpanelEventsLastDate implements StatisticsProviderInterface
{
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
    public function getData(array $param): Statistic
    {

        $statistic = new Statistic();
        $statistic->setId(self::KEY);
        $statistic->setData([
            'type' => 'date',
            'value' => '2020-09-10'
        ]);

        return $statistic;
    }
}
