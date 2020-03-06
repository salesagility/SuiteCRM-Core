<?php


namespace App\DataProvider;

use ApiPlatform\Core\DataProvider\ArrayPaginator;
use ApiPlatform\Core\DataProvider\ContextAwareCollectionDataProviderInterface;
use ApiPlatform\Core\DataProvider\PaginatorInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use App\Entity\SystemConfig;

/**
 * Class SystemConfigCollectionDataProvider
 * @package App\DataProvider
 */
class SystemConfigCollectionDataProvider implements ContextAwareCollectionDataProviderInterface,
    RestrictedDataProviderInterface
{

    /**
     * Define supported Resource Classes
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
     * {@inheritdoc}
     */
    public function getCollection(
        string $resourceClass,
        string $operationName = null,
        array $context = []
    ): PaginatorInterface {
        $systemConfigs = [];

        $defaultLanguage = new SystemConfig();
        $defaultLanguage->setId('default_language');
        $defaultLanguage->setValue('en_us');
        $systemConfigs[] = $defaultLanguage;

        $passwordSettings = new SystemConfig();
        $passwordSettings->setId('password_settings');
        $passwordSettings->setItems(
            [
                'password_recovery_enabled' => 'true'
            ]
        );

        $systemConfigs[] = $passwordSettings;

        return new ArrayPaginator($systemConfigs, 0, count($systemConfigs));
    }
}
