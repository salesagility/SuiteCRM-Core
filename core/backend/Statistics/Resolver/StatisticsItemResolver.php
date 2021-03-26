<?php

namespace App\Statistics\Resolver;

use ApiPlatform\Core\GraphQl\Resolver\QueryItemResolverInterface;
use App\Statistics\Entity\Statistic;
use App\Statistics\Service\StatisticsManagerInterface;

class StatisticsItemResolver implements QueryItemResolverInterface
{
    /**
     * @var StatisticsManagerInterface
     */
    private $manager;

    /**
     * StatisticsItemResolver constructor.
     * @param StatisticsManagerInterface $manager
     */
    public function __construct(StatisticsManagerInterface $manager)
    {
        $this->manager = $manager;
    }

    /**
     * @param Statistic|null $item
     *
     * @param array $context
     * @return Statistic|null
     */
    public function __invoke($item, array $context): ?Statistic
    {
        $query = $context['args']['queries'] ?? [];
        $module = $context['args']['module'] ?? '';

        if (empty($query)) {
            return null;
        }

        return $this->manager->getStatistic($module, $query);
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
