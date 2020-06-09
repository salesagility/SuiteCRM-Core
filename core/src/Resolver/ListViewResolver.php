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
        $limit = -1;
        $offset = -1;
        $criteria = [];
        $module = '';

        if (isset($context['args']['module'])) {
            $module = $context['args']['module'];
        }

        if (isset($context['args']['limit'])) {
            $limit = $context['args']['limit'];
        }

        if (isset($context['args']['offset'])) {
            $offset = $context['args']['offset'];
        }

        if (isset($context['args']['criteria'])) {
            $criteria = $context['args']['criteria'];
        }

        return $this->listViewHandler->getListView($module, $criteria, $offset, $limit);
    }
}