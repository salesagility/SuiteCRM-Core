<?php

namespace App\DataProvider;

use ApiPlatform\Core\DataProvider\ArrayPaginator;
use ApiPlatform\Core\DataProvider\ContextAwareCollectionDataProviderInterface;
use ApiPlatform\Core\DataProvider\PaginatorInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use App\Entity\Statistic;
use App\Service\StatisticsProviderRegistry;

/**
 * Class UserPreferenceCollectionDataProvider
 */
class StatisticsCollectionDataProvider implements ContextAwareCollectionDataProviderInterface,
                                                  RestrictedDataProviderInterface
{
    /**
     * @var StatisticsProviderRegistry
     */
    private $registry;

    /**
     * StatisticsCollectionDataProvider constructor.
     * @param StatisticsProviderRegistry $registry
     */
    public function __construct(StatisticsProviderRegistry $registry)
    {
        $this->registry = $registry;
    }


    /**
     * Define supported Resource Classes
     * @param string $resourceClass
     * @param string|null $operationName
     * @param array $context
     * @return bool
     */
    public function supports(string $resourceClass, string $operationName = null, array $context = []): bool
    {
        return Statistic::class === $resourceClass;
    }


    /**
     * {@inheritdoc}
     */
    public function getCollection(
        string $resourceClass,
        string $operationName = null,
        array $context = []
    ): ?PaginatorInterface {
        $queries = $context['filters']['queries'] ?? [];

        $result = [];

        foreach ($queries as $query) {
            if (empty($query)) {
                continue;
            }

            if (empty($query['key'])) {
                continue;
            }

            [$module] = $this->extractContext($query);

            $key = $query['key'];

            $moduleKey = $module . '-' . $key;

            if ($this->registry->has($moduleKey)) {
                $result[$key] = $this->registry->get($moduleKey)->getData($query);
                continue;
            }

            if (!$this->registry->has($key)) {
                $key = 'default';
            }

            $result[$key] = $this->registry->get($key)->getData($query);
        }

        return new ArrayPaginator($result, 0, count($result));
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
