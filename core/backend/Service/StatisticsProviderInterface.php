<?php

namespace App\Service;

use App\Entity\Statistic;

interface StatisticsProviderInterface
{
    /**
     * Get statistics provider key
     * @return string
     */
    public function getKey(): string;

    /**
     * Get statistics data
     * @param array $query
     * @return Statistic
     */
    public function getData(array $query): Statistic;
}
