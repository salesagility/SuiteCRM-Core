<?php

namespace App\DataProvider;

use ApiPlatform\Core\DataProvider\ItemDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use App\Entity\SystemConfig;

/**
 * Class SystemConfigItemDataProvider
 */
final class SystemConfigItemDataProvider implements ItemDataProviderInterface, RestrictedDataProviderInterface
{
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
        $config = new SystemConfig();
        $config->setId('default_language');
        $config->setValue('en_us');

        return $config;
    }
}