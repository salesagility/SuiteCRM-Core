<?php


namespace App\SystemConfig\DataProvider;

use ApiPlatform\Core\DataProvider\ArrayPaginator;
use ApiPlatform\Core\DataProvider\ContextAwareCollectionDataProviderInterface;
use ApiPlatform\Core\DataProvider\PaginatorInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use App\SystemConfig\Entity\SystemConfig;
use App\SystemConfig\Service\SystemConfigProviderInterface;

/**
 * Class SystemConfigCollectionDataProvider
 */
class SystemConfigCollectionDataProvider implements ContextAwareCollectionDataProviderInterface,
    RestrictedDataProviderInterface
{

    /**
     * @var SystemConfigProviderInterface
     */
    private $systemConfigProvider;

    /**
     * SystemConfigCollectionDataProvider constructor.
     * @param SystemConfigProviderInterface $systemConfigProvider
     */
    public function __construct(SystemConfigProviderInterface $systemConfigProvider)
    {
        $this->systemConfigProvider = $systemConfigProvider;
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
        return SystemConfig::class === $resourceClass;
    }


    /**
     * {@inheritdoc}
     */
    public function getCollection(
        string $resourceClass,
        string $operationName = null,
        array $context = []
    ): PaginatorInterface {
        $systemConfigs = $this->systemConfigProvider->getAllSystemConfigs();

        return new ArrayPaginator($systemConfigs, 0, count($systemConfigs));
    }
}
