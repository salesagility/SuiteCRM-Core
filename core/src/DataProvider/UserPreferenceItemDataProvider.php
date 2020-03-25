<?php

namespace App\DataProvider;

use ApiPlatform\Core\DataProvider\ItemDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use App\Entity\UserPreference;
use SuiteCRM\Core\Legacy\UserPreferenceHandler;

/**
 * Class UserPreferenceItemDataProvider
 */
final class UserPreferenceItemDataProvider implements ItemDataProviderInterface, RestrictedDataProviderInterface
{

    /**
     * @var UserPreferenceHandler
     */
    private $userPreferenceHandler;

    /**
     * UserPreferenceItemDataProvider constructor.
     * @param UserPreferenceHandler $userPreferenceHandler
     */
    public function __construct(UserPreferenceHandler $userPreferenceHandler)
    {
        $this->userPreferenceHandler = $userPreferenceHandler;
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
        return UserPreference::class === $resourceClass;
    }

    /**
     * Get user preference
     * @param string $resourceClass
     * @param array|int|string $id
     * @param string|null $operationName
     * @param array $context
     * @return UserPreference|null
     */
    public function getItem(
        string $resourceClass,
        $id,
        string $operationName = null,
        array $context = []
    ): ?UserPreference {
        return $this->userPreferenceHandler->getUserPreference($id);
    }
}