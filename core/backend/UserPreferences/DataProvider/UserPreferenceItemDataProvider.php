<?php

namespace App\UserPreferences\DataProvider;

use ApiPlatform\Core\DataProvider\ItemDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use App\UserPreferences\Entity\UserPreference;
use App\UserPreferences\Service\UserPreferencesProviderInterface;

/**
 * Class UserPreferenceItemDataProvider
 */
final class UserPreferenceItemDataProvider implements ItemDataProviderInterface, RestrictedDataProviderInterface
{

    /**
     * @var UserPreferencesProviderInterface
     */
    private $userPreferenceService;

    /**
     * UserPreferenceItemDataProvider constructor.
     * @param UserPreferencesProviderInterface $userPreferenceService
     */
    public function __construct(UserPreferencesProviderInterface $userPreferenceService)
    {
        $this->userPreferenceService = $userPreferenceService;
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
        return $this->userPreferenceService->getUserPreference($id);
    }
}
