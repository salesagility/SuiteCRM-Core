<?php

namespace App\Resolver;

use ApiPlatform\Core\GraphQl\Resolver\QueryItemResolverInterface;
use App\Entity\RecordList;
use SuiteCRM\Core\Legacy\RecordListHandler;

class RecordListResolver implements QueryItemResolverInterface
{
    /**
     * @var RecordListHandler
     */
    protected $recordListHandler;

    /**
     * RecordListResolver constructor.
     * @param RecordListHandler $recordListHandler
     */
    public function __construct(RecordListHandler $recordListHandler)
    {
        $this->recordListHandler = $recordListHandler;
    }

    /**
     * @param RecordList|null $item
     *
     * @param array $context
     * @return RecordList
     */
    public function __invoke($item, array $context): RecordList
    {

        $module = $context['args']['module'] ?? '';
        $limit = $context['args']['limit'] ?? -1;
        $offset = $context['args']['offset'] ?? -1;
        $criteria = $context['args']['criteria'] ?? [];
        $sort = $context['args']['sort'] ?? [];

        return $this->recordListHandler->getList($module, $criteria, $offset, $limit, $sort);
    }
}
