<?php

namespace SuiteCRM\Core\Legacy\Statistics;

use App\Entity\Statistic;
use App\Service\StatisticsProviderInterface;

class SubpanelLeadsTotal implements StatisticsProviderInterface
{
    public const KEY = 'leads';

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
            'type' => 'int',
            'value' => '4'
        ]);

        return $statistic;
    }
}
