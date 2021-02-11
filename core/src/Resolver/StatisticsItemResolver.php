<?php

namespace App\Resolver;

use ApiPlatform\Core\GraphQl\Resolver\QueryItemResolverInterface;
use App\Entity\Statistic;
use App\Service\StatisticsProviderRegistry;

class StatisticsItemResolver implements QueryItemResolverInterface
{
    /**
     * @var StatisticsProviderRegistry
     */
    private $registry;

    /**
     * StatisticsItemResolver constructor.
     * @param StatisticsProviderRegistry $statisticsProviderRegistry
     */
    public function __construct(StatisticsProviderRegistry $statisticsProviderRegistry)
    {
        $this->registry = $statisticsProviderRegistry;
    }

    /**
     * @param Statistic|null $item
     *
     * @param array $context
     * @return Statistic|null
     */
    public function __invoke($item, array $context): ?Statistic
    {
        $query = $context['args']['query'] ?? [];

        if (empty($query)) {
            return null;
        }

        [$module] = $this->extractContext($query);

        $key = $context['args']['query']['key'] ?? 'default';

        $moduleKey = $module . '-' . $key;

        if ($this->registry->has($moduleKey)) {
            return $this->registry->get($moduleKey)->getData($query);
        }

        if (!$this->registry->has($key)) {
            $key = 'default';
        }

        return $this->registry->get($key)->getData($query);
    }

    /**
     * @param array $query
     * @return array
     */
    protected function extractContext(array $query): array
    {
        $module = $query['context']['module'] ?? '';
        $id = $query['context']['id'] ?? '';

        return array($module, $id);
    }
}
