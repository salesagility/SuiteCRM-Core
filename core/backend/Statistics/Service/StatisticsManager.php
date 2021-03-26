<?php

namespace App\Statistics\Service;

use App\Statistics\Entity\BatchedStatistics;
use App\Statistics\Entity\Statistic;
use Psr\Log\LoggerAwareInterface;
use Psr\Log\LoggerInterface;
use Throwable;

class StatisticsManager implements LoggerAwareInterface, StatisticsManagerInterface
{
    /**
     * @var StatisticsProviderRegistry
     */
    protected $registry;

    /**
     * @var LoggerInterface
     */
    protected $logger;

    /**
     * StatisticsItemResolver constructor.
     * @param StatisticsProviderRegistry $statisticsProviderRegistry
     */
    public function __construct(StatisticsProviderRegistry $statisticsProviderRegistry)
    {
        $this->registry = $statisticsProviderRegistry;
    }

    /**
     * @inheritDoc
     */
    public function getBatched(string $module, array $queries): ?BatchedStatistics
    {
        $result = [];

        foreach ($queries as $statKey => $query) {
            if (empty($query)) {
                continue;
            }

            if (empty($query['key'])) {
                continue;
            }

            $stat = $this->getStatistic($module, $query);

            if ($stat === null) {
                continue;
            }

            $result[$statKey] = $stat->toArray();
        }

        $batched = new BatchedStatistics();
        $batched->setId($module);
        $batched->setItems($result);

        return $batched;
    }

    /**
     * @inheritDoc
     */
    public function getStatistic(string $module, array $query): ?Statistic
    {

        if (empty($query)) {
            return null;
        }

        $originalKey = $query['key'] ?? 'default';
        $key = $originalKey;

        $moduleKey = $module . '-' . $key;

        if ($this->registry->has($moduleKey)) {
            return $this->callStatistic($originalKey, $moduleKey, $query);
        }

        if (!$this->registry->has($key)) {
            $key = 'default';
        }

        return $this->callStatistic($originalKey, $key, $query);
    }

    /**
     * @param string $originalKey
     * @param string $key
     * @param array $query
     * @return Statistic
     */
    protected function callStatistic(string $originalKey, string $key, array $query): Statistic
    {
        try {
            $result = $this->registry->get($key)->getData($query);
        } catch (Throwable $t) {
            $this->logger->error($t->getMessage(), ['exception' => $t]);
            $result = $this->registry->get('error')->getData($query);
        }

        $result->setId($originalKey);

        return $result;
    }

    /**
     * @inheritDoc
     */
    public function setLogger(LoggerInterface $logger): void
    {
        $this->logger = $logger;
    }
}
