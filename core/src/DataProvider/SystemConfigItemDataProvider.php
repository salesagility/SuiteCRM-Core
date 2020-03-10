<?php

namespace App\DataProvider;

use ApiPlatform\Core\DataProvider\ItemDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use App\Entity\SystemConfig;
use SuiteCRM\Core\Legacy\SystemConfigHandler;

/**
 * Class SystemConfigItemDataProvider
 */
final class SystemConfigItemDataProvider implements ItemDataProviderInterface, RestrictedDataProviderInterface
{

    /**
     * @var SystemConfigHandler
     */
    private $systemConfigHandler;

    /**
     * SystemConfigItemDataProvider constructor.
     * @param SystemConfigHandler $systemConfigHandler
     */
    public function __construct(SystemConfigHandler $systemConfigHandler)
    {
        $this->systemConfigHandler = $systemConfigHandler;
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

        return $this->systemConfigHandler->getSystemConfig($id);
    }
}