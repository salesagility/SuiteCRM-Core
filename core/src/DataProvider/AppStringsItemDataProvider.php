<?php

namespace App\DataProvider;

use ApiPlatform\Core\DataProvider\ItemDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use App\Entity\AppStrings;
use SuiteCRM\Core\Legacy\AppStringsHandler;

/**
 * Class AppStringsItemDataProvider
 */
final class AppStringsItemDataProvider implements ItemDataProviderInterface, RestrictedDataProviderInterface
{

    /**
     * @var AppStringsHandler
     */
    private $appStringsHandler;

    /**
     * AppStringsItemDataProvider constructor.
     * @param AppStringsHandler $appStringsHandler
     */
    public function __construct(AppStringsHandler $appStringsHandler)
    {
        $this->appStringsHandler = $appStringsHandler;
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

        return $this->appStringsHandler->getAppStrings($id);
    }
}