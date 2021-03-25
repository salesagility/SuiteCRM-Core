<?php

namespace App\Resolver;

use ApiPlatform\Core\GraphQl\Resolver\QueryItemResolverInterface;
use App\Statistics\Entity\BatchedStatistics;
use App\Service\StatisticsManagerInterface;

class BatchedStatisticsItemResolver implements QueryItemResolverInterface
{
    /**
     * @var StatisticsManagerInterface
     */
    private $manager;

    /**
     * BatchedStatisticsItemResolver constructor.
     * @param StatisticsManagerInterface $manager
     */
    public function __construct(StatisticsManagerInterface $manager)
    {
        $this->manager = $manager;
    }

    /**
     * @param BatchedStatistics|null $item
     *
     * @param array $context
     * @return BatchedStatistics|null
     */
    public function __invoke($item, array $context): ?BatchedStatistics
    {
        $query = $context['args']['queries'] ?? [];
        $module = $context['args']['module'] ?? '';

        return $this->manager->getBatched($module, $query);
    }

    /**
     * @param array $query
     * @return array
     */
    protected function extractContext(array $query): array
    {
        $module = $query['context']['module'] ?? '';
        $id = $query['context']['id'] ?? '';

        return [$module, $id];
    }
}
