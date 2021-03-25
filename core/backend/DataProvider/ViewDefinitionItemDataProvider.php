<?php

namespace App\DataProvider;

use ApiPlatform\Core\DataProvider\ItemDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use App\ViewDefinitions\Entity\ViewDefinition;
use App\Service\ViewDefinitionsProviderInterface;
use Exception;

/**
 * Class ViewDefinitionItemDataProvider
 * @package App\DataProvider
 */
class ViewDefinitionItemDataProvider implements ItemDataProviderInterface, RestrictedDataProviderInterface
{
    /**
     * @var ViewDefinitionsProviderInterface
     */
    protected $viewDefHandler;

    /**
     * ViewDefinitionItemDataProvider constructor.
     * @param ViewDefinitionsProviderInterface $viewDefHandler
     */
    public function __construct(ViewDefinitionsProviderInterface $viewDefHandler)
    {
        $this->viewDefHandler = $viewDefHandler;
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
        return ViewDefinition::class === $resourceClass;
    }

    /**
     * @param string $resourceClass
     * @param array|int|string $id
     * @param string|null $operationName
     * @param array $context
     * @return ViewDefinition|null
     * @throws Exception
     */
    public function getItem(
        string $resourceClass,
        $id,
        string $operationName = null,
        array $context = []
    ): ?ViewDefinition {

        $attributes = [];
        if (!empty($context['attributes'])) {
            $attributes = array_keys($context['attributes']);
        }

        return $this->viewDefHandler->getViewDefs($id, $attributes);
    }
}
