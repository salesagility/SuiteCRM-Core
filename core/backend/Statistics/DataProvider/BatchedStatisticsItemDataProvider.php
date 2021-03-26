<?php

namespace App\Statistics\DataProvider;

use ApiPlatform\Core\DataProvider\ItemDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use App\Statistics\Entity\BatchedStatistics;
use App\Service\StatisticsManagerInterface;

class BatchedStatisticsItemDataProvider implements ItemDataProviderInterface, RestrictedDataProviderInterface
{
    /**
     * @var StatisticsManagerInterface
     */
    private $manager;

    /**
     * BatchedStatisticsItemDataProvider constructor.
     * @param StatisticsManagerInterface $manager
     */
    public function __construct(StatisticsManagerInterface $manager)
    {
        $this->manager = $manager;
    }


    /**
     * Defined supported resources
     * @param string $resourceClass
     * @param string|null $operationName
     * @param array $context
     * @return bool
     */
    public function supports(
        string $resourceClass,
        string $operationName = null,
        array $context = []
    ): bool {
        return BatchedStatistics::class === $resourceClass;
    }

    /**
     * Get batched statistics
     * @param string $resourceClass
     * @param array|int|string $id
     * @param string|null $operationName
     * @param array $context
     * @return BatchedStatistics|null
     */
    public function getItem(
        string $resourceClass,
        $id,
        string $operationName = null,
        array $context = []
    ): ?BatchedStatistics {

        return null;
    }
}
