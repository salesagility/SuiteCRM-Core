<?php

namespace App\DataProvider;

use ApiPlatform\Core\DataProvider\ItemDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use App\Entity\AppStrings;

/**
 * Class AppStringsItemDataProvider
 */
final class AppStringsItemDataProvider implements ItemDataProviderInterface, RestrictedDataProviderInterface
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
        return AppStrings::class === $resourceClass;
    }

    /**
     * Get app strings for given language id
     * @param string $resourceClass
     * @param array|int|string $id
     * @param string|null $operationName
     * @param array $context
     * @return AppStrings|null
     */
    public function getItem(
        string $resourceClass,
        $id,
        string $operationName = null,
        array $context = []
    ): ?AppStrings {
        $config = new AppStrings();

        $config->setId('en_us');

        $config->setItems(
            [
                'LBL_NAME' => 'Name'
            ]
        );

        return $config;
    }
}