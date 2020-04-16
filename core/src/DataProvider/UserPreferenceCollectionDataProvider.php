<?php

namespace App\DataProvider;

use ApiPlatform\Core\DataProvider\ArrayPaginator;
use ApiPlatform\Core\DataProvider\ContextAwareCollectionDataProviderInterface;
use ApiPlatform\Core\DataProvider\PaginatorInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use App\Entity\UserPreference;
use App\Service\UserPreferencesProviderInterface;

/**
 * Class UserPreferenceCollectionDataProvider
 */
class UserPreferenceCollectionDataProvider implements ContextAwareCollectionDataProviderInterface,
    RestrictedDataProviderInterface
{

    /**
     * @var UserPreferencesProviderInterface
     */
    private $userPreferencesService;

    /**
     * UserPreferenceCollectionDataProvider constructor.
     * @param UserPreferencesProviderInterface $userPreferenceService
     */
    public function __construct(UserPreferencesProviderInterface $userPreferenceService)
    {
        $this->userPreferencesService = $userPreferenceService;
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
        return UserPreference::class === $resourceClass;
    }


    /**
     * {@inheritdoc}
     */
    public function getCollection(
        string $resourceClass,
        string $operationName = null,
        array $context = []
    ): PaginatorInterface {
        $userPreferences = $this->userPreferencesService->getAllUserPreferences();

        return new ArrayPaginator($userPreferences, 0, count($userPreferences));
    }
}
