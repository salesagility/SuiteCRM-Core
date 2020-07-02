<?php

namespace App\Resolver;

use ApiPlatform\Core\GraphQl\Resolver\QueryItemResolverInterface;
use App\Entity\ListView;
use SuiteCRM\Core\Legacy\ListViewHandler;

class ListViewResolver implements QueryItemResolverInterface
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
     * @param ListView|null $item
     *
     * @param array $context
     * @return ListView
     */
    public function __invoke($item, array $context): ListView
    {

        $module = $context['args']['module'] ?? '';
        $limit = $context['args']['limit'] ?? -1;
        $offset = $context['args']['offset'] ?? -1;
        $criteria = $context['args']['criteria'] ?? [];
        $sort = $context['args']['sort'] ?? [];

        return $this->listViewHandler->getListView($module, $criteria, $offset, $limit, $sort);
    }
}