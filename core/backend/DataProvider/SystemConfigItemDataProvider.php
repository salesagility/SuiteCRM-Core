<?php

namespace App\DataProvider;

use ApiPlatform\Core\DataProvider\ItemDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use App\Entity\SystemConfig;
use App\Service\SystemConfigProviderInterface;

/**
 * Class SystemConfigItemDataProvider
 */
final class SystemConfigItemDataProvider implements ItemDataProviderInterface, RestrictedDataProviderInterface
{

    /**
     * @var SystemConfigProviderInterface
     */
    private $systemConfigProvider;

    /**
     * SystemConfigItemDataProvider constructor.
     * @param SystemConfigProviderInterface $systemConfigProvider
     */
    public function __construct(SystemConfigProviderInterface $systemConfigProvider)
    {
        $this->systemConfigProvider = $systemConfigProvider;
    }

    /**
     * Defined supported resources
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
     * Get system config
     * @param string $resourceClass
     * @param array|int|string $id
     * @param string|null $operationName
     * @param array $context
     * @return SystemConfig|null
     */
    public function getItem(
        string $resourceClass,
        $id,
        string $operationName = null,
        array $context = []
    ): ?SystemConfig {

        return $this->systemConfigProvider->getSystemConfig($id);
    }
}