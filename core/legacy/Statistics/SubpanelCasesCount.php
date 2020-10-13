<?php

namespace SuiteCRM\Core\Legacy\Statistics;

use App\Entity\Statistic;
use App\Service\StatisticsProviderInterface;

class SubpanelCasesCount implements StatisticsProviderInterface
{
    public const KEY = 'cases';

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
            'value' => '5'
        ]);

        return $statistic;
    }
}
