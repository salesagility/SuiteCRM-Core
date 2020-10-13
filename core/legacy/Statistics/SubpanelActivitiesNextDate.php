<?php

namespace SuiteCRM\Core\Legacy\Statistics;

use App\Entity\Statistic;
use App\Service\StatisticsProviderInterface;

class SubpanelActivitiesNextDate implements StatisticsProviderInterface
{
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
    public function getData(array $param): Statistic
    {

        $statistic = new Statistic();
        $statistic->setId(self::KEY);
        $statistic->setData([
            'type' => 'date',
            'value' => '2020-12-05'
        ]);

        return $statistic;
    }
}
