<?php

namespace App\Service;

use App\Entity\BatchedStatistics;
use App\Entity\Statistic;

interface StatisticsManagerInterface
{
    /**
     * Get statistic
     * @param string $module
     * @param array $query
     * @return Statistic|null
     */
    public function getStatistic(string $module, array $query): ?Statistic;

    /**
     * Get batched statistics
     * @param string $module
     * @param array $queries
     * @return BatchedStatistics|null
     */
    public function getBatched(string $module, array $queries): ?BatchedStatistics;
}
