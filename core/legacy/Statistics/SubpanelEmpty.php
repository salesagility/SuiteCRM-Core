<?php

namespace App\Legacy\Statistics;

use App\Entity\Statistic;
use App\Service\StatisticsProviderInterface;

class SubpanelEmpty implements StatisticsProviderInterface
{
    public const KEY = 'empty';

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
            'value' => '-'
        ]);

        $statistic->setMetadata([
            'type' => 'single-value-statistic',
            'dataType' => 'varchar',
        ]);

        return $statistic;
    }
}
