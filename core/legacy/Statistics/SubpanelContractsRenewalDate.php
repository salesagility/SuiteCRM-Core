<?php

namespace App\Legacy\Statistics;

use App\Entity\Statistic;
use App\Service\StatisticsProviderInterface;

class SubpanelContractsRenewalDate implements StatisticsProviderInterface
{
    public const KEY = 'contracts';

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
            'value' => '2021-02-15'
        ]);

        $statistic->setMetadata([
            'type' => 'single-value-statistic',
            'dataType' => 'date',
        ]);

        return $statistic;
    }
}
