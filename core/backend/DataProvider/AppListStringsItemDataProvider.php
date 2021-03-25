<?php

namespace App\DataProvider;

use ApiPlatform\Core\DataProvider\ItemDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use App\Entity\AppListStrings;
use App\Languages\LegacyHandler\AppListStringsHandler;

/**
 * Class AppListStringsItemDataProvider
 */
final class AppListStringsItemDataProvider implements ItemDataProviderInterface, RestrictedDataProviderInterface
{
    /**
     * @var AppListStringsHandler
     */
    private $appListStringsHandler;

    /**
     * AppListStringsItemDataProvider constructor.
     * @param AppListStringsHandler $appListStringsHandler
     */
    public function __construct(AppListStringsHandler $appListStringsHandler)
    {
        $this->appListStringsHandler = $appListStringsHandler;
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
        return AppListStrings::class === $resourceClass;
    }

    /**
     * Get app list strings for given language id
     * @param string $resourceClass
     * @param array|int|string $id
     * @param string|null $operationName
     * @param array $context
     * @return AppListStrings|null
     */
    public function getItem(
        string $resourceClass,
        $id,
        string $operationName = null,
        array $context = []
    ): ?AppListStrings {

        return $this->appListStringsHandler->getAppListStrings($id);
    }
}
