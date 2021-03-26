<?php

namespace App\Statistics\DataProvider;

use ApiPlatform\Core\DataProvider\ItemDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use App\Statistics\Entity\Statistic;
use App\Statistics\Service\StatisticsProviderRegistry;

class StatisticsItemDataProvider implements ItemDataProviderInterface, RestrictedDataProviderInterface
{
    /**
     * @var StatisticsProviderRegistry
     */
    private $registry;

    /**
     * StatisticsItemDataProvider constructor.
     * @param StatisticsProviderRegistry $registry
     */
    public function __construct(StatisticsProviderRegistry $registry)
    {
        $this->registry = $registry;
    }


    /**
     * Defined supported resources
     * @param string $resourceClass
     * @param string|null $operationName
     * @param array $context
     * @return bool
     */
    public
    function supports(
        string $resourceClass,
        string $operationName = null,
        array $context = []
    ): bool {
        return Statistic::class === $resourceClass;
    }

    /**
     * Get chart data for given chart id
     * @param string $resourceClass
     * @param array|int|string $id
     * @param string|null $operationName
     * @param array $context
     * @return Statistic|null
     */
    public function getItem(
        string $resourceClass,
        $id,
        string $operationName = null,
        array $context = []
    ): ?Statistic {
        return null;
    }
}
