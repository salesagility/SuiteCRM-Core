<?php

namespace App\Statistics\LegacyHandler;

use App\Statistics\Entity\Statistic;
use App\Statistics\Service\StatisticsProviderInterface;
use App\Statistics\StatisticsHandlingTrait;

class DefaultError implements StatisticsProviderInterface
{
    use StatisticsHandlingTrait;

    public const KEY = 'error';

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
        return $this->getErrorResponse(self::KEY);
    }
}
