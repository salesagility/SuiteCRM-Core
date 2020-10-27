<?php

namespace App\DataProvider;

use ApiPlatform\Core\DataProvider\ItemDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use App\Entity\ClassicView;
use App\Legacy\ClassicViewHandler;

/**
 * Class ClassicViewItemDataProvider
 * @package App\DataProvider
 */
final class ClassicViewItemDataProvider implements ItemDataProviderInterface, RestrictedDataProviderInterface
{

    /**
     * @var ClassicViewHandler
     */
    private $classicViewHandler;

    /**
     * ClassicViewItemDataProvider constructor.
     * @param ClassicViewHandler $classicViewHandler
     */
    public function __construct(ClassicViewHandler $classicViewHandler)
    {
        $this->classicViewHandler = $classicViewHandler;
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
        return ClassicView::class === $resourceClass;
    }

    /**
     * Get Item
     * @param string $resourceClass
     * @param array|int|string $id
     * @param string|null $operationName
     * @param array $context
     * @return ClassicView|null
     */
    public function getItem(string $resourceClass, $id, string $operationName = null, array $context = []): ?ClassicView
    {
        $params = [];
        if (!empty($context['args']) && !empty($context['args']['params'])) {
            $params = $context['args']['params'];
        }

        return $this->classicViewHandler->getClassicView($id, $params);
    }
}
