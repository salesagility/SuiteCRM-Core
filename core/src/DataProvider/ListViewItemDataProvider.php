<?php

namespace App\DataProvider;

use ApiPlatform\Core\DataProvider\ItemDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use App\Entity\ListView;
use Exception;
use SuiteCRM\Core\Legacy\ListViewHandler;

/**
 * Class ListViewItemDataProvider
 * @package App\DataProvider
 */
class ListViewItemDataProvider implements ItemDataProviderInterface, RestrictedDataProviderInterface
{
    /**
     * @var ListViewHandler
     */
    protected $listViewHandler;

    /**
     * ListViewItemDataProvider constructor.
     * @param ListViewHandler $listViewHandler
     */
    public function __construct(ListViewHandler $listViewHandler)
    {
        $this->listViewHandler = $listViewHandler;
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
        return ListView::class === $resourceClass;
    }

    /**
     * @param string $resourceClass
     * @param array|int|string $id
     * @param string|null $operationName
     * @param array $context
     * @return ListView|null
     * @throws Exception
     */
    public function getItem(
        string $resourceClass,
        $id,
        string $operationName = null,
        array $context = []
    ): ?ListView {
        return $this->listViewHandler->getListView($id);
    }
}
