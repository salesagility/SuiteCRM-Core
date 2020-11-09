<?php

namespace App\Legacy\Statistics;

use App\Entity\Statistic;
use DateTimeService;
use Exception;

trait DateTimeStatisticsHandlingTrait
{
    use StatisticsHandlingTrait;

    /**
     * @param string $key
     * @param string $start
     * @param string|null $end
     * @return Statistic
     * @throws Exception
     */
    protected function getDateDiffStatistic(string $key, string $start, string $end = null): Statistic
    {
        /* @noinspection PhpIncludeInspection */
        require_once 'include/portability/Services/DateTime/DateTimeService.php';
        $datetimeService = new DateTimeService();
        $days = $datetimeService->diffDateStrings($start, $end);

        if ($days === null) {
            return $this->getEmptyResponse($key);
        }

        $result = [
            'value' => $days
        ];

        return $this->buildSingleValueResponse($key, 'int', $result);
    }
}
