<?php

namespace App\DataProvider;

use ApiPlatform\Core\DataProvider\ItemDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use App\Entity\FieldDefinition;
use App\Legacy\FieldDefinitionsHandler;
use Exception;

/**
 * Class FieldDefinitionItemDataProvider
 * @package App\DataProvider
 */
class FieldDefinitionItemDataProvider implements ItemDataProviderInterface, RestrictedDataProviderInterface
{
    /**
     * @var FieldDefinitionsHandler
     */
    protected $vardefHandler;

    /**
     * FieldDefinitionItemDataProvider constructor.
     * @param FieldDefinitionsHandler $vardefHandler
     */
    public function __construct(FieldDefinitionsHandler $vardefHandler)
    {
        $this->vardefHandler = $vardefHandler;
    }

    /**
     * Define supported resources
     * @param string $resourceClass
     * @param string|null $operationName
     * @param array $context
     * @return bool
     */
    public function supports(string $resourceClass, string $operationName = null, array $context = []): bool
    {
        return FieldDefinition::class === $resourceClass;
    }

    /**
     * @param string $resourceClass
     * @param array|int|string $id
     * @param string|null $operationName
     * @param array $context
     * @return FieldDefinition|null
     * @throws Exception
     */
    public function getItem(
        string $resourceClass,
        $id,
        string $operationName = null,
        array $context = []
    ): ?FieldDefinition {
        return $this->vardefHandler->getVardef($id);
    }
}
