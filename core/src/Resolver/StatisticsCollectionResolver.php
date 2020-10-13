<?php


namespace App\Resolver;


use ApiPlatform\Core\GraphQl\Resolver\QueryCollectionResolverInterface;
use App\Entity\Statistic;

class StatisticsCollectionResolver implements QueryCollectionResolverInterface
{
    /**
     * @param iterable<Statistic> $collection
     *
     * @param array $context
     * @return iterable<Statistic>
     */
    public function __invoke(iterable $collection, array $context): iterable
    {
        return $collection;
    }
}
