<?php

namespace App\Legacy\Statistics;

use App\Entity\Statistic;
use App\Service\StatisticsProviderInterface;

class SubpanelDefault implements StatisticsProviderInterface
{
    public const KEY = 'default';

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
            'value' => '0'
        ]);

        $statistic->setMetadata([
            'type' => 'single-value-statistic',
            'dataType' => 'int',
        ]);

        return $statistic;
    }
}
