<?php

namespace App\Legacy\Statistics;

use App\Entity\Statistic;
use App\Service\StatisticsProviderInterface;

class SubpanelCampaignsLastReceived implements StatisticsProviderInterface
{
    public const KEY = 'campaign-log';

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
            'value' => '2020-08-28'
        ]);

        $statistic->setMetadata([
            'type' => 'single-value-statistic',
            'dataType' => 'date',
        ]);

        return $statistic;
    }
}
