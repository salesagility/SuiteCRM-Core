<?php

namespace App\DataProvider;

use ApiPlatform\Core\DataProvider\ArrayPaginator;
use ApiPlatform\Core\DataProvider\ContextAwareCollectionDataProviderInterface;
use ApiPlatform\Core\DataProvider\PaginatorInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use App\Entity\UserPreference;
use SuiteCRM\Core\Legacy\UserPreferenceHandler;

/**
 * Class UserPreferenceCollectionDataProvider
 */
class UserPreferenceCollectionDataProvider implements ContextAwareCollectionDataProviderInterface,
    RestrictedDataProviderInterface
{

    /**
     * @var UserPreferenceHandler
     */
    private $userPreferenceHandler;

    /**
     * UserPreferenceCollectionDataProvider constructor.
     * @param UserPreferenceHandler $userPreferenceHandler
     */
    public function __construct(UserPreferenceHandler $userPreferenceHandler)
    {
        $this->userPreferenceHandler = $userPreferenceHandler;
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
        $userPreferences = $this->userPreferenceHandler->getAllUserPreferences();

        return new ArrayPaginator($userPreferences, 0, count($userPreferences));
    }
}
