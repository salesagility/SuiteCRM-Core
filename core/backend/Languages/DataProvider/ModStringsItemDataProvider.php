<?php

namespace App\Languages\DataProvider;

use ApiPlatform\Core\DataProvider\ItemDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use App\Languages\Entity\ModStrings;
use App\Languages\LegacyHandler\ModStringsHandler;

/**
 * Class ModStringsItemDataProvider
 */
final class ModStringsItemDataProvider implements ItemDataProviderInterface, RestrictedDataProviderInterface
{

    /**
     * @var ModStringsHandler
     */
    private $modStringsHandler;

    /**
     * ModStringsItemDataProvider constructor.
     * @param ModStringsHandler $modStringsHandler
     */
    public function __construct(ModStringsHandler $modStringsHandler)
    {
        $this->modStringsHandler = $modStringsHandler;
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
        return ModStrings::class === $resourceClass;
    }

    /**
     * Get mod strings for given language id
     * @param string $resourceClass
     * @param array|int|string $id
     * @param string|null $operationName
     * @param array $context
     * @return ModStrings|null
     */
    public function getItem(
        string $resourceClass,
        $id,
        string $operationName = null,
        array $context = []
    ): ?ModStrings {

        return $this->modStringsHandler->getModStrings($id);
    }
}
