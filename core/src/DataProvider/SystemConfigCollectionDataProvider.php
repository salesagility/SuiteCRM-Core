<?php


namespace App\DataProvider;

use ApiPlatform\Core\DataProvider\ArrayPaginator;
use ApiPlatform\Core\DataProvider\ContextAwareCollectionDataProviderInterface;
use ApiPlatform\Core\DataProvider\PaginatorInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use App\Entity\SystemConfig;
use SuiteCRM\Core\Legacy\SystemConfigHandler;

/**
 * Class SystemConfigCollectionDataProvider
 */
class SystemConfigCollectionDataProvider implements ContextAwareCollectionDataProviderInterface,
    RestrictedDataProviderInterface
{

    /**
     * @var SystemConfigHandler
     */
    private $systemConfigHandler;

    /**
     * SystemConfigCollectionDataProvider constructor.
     * @param SystemConfigHandler $systemConfigHandler
     */
    public function __construct(SystemConfigHandler $systemConfigHandler)
    {
        $this->systemConfigHandler = $systemConfigHandler;
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
        $systemConfigs = $this->systemConfigHandler->getAllSystemConfigs();

        return new ArrayPaginator($systemConfigs, 0, count($systemConfigs));
    }
}
