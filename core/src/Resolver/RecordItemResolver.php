<?php

namespace App\Resolver;

use ApiPlatform\Core\GraphQl\Resolver\QueryItemResolverInterface;
use App\Entity\Record;
use Exception;
use App\Legacy\RecordHandler;

class RecordItemResolver implements QueryItemResolverInterface
{
    /**
     * @var RecordHandler
     */
    protected $recordHandler;

    /**
     * RecordViewResolver constructor.
     * @param RecordHandler $recordHandler
     */
    public function __construct(RecordHandler $recordHandler)
    {
        $this->recordHandler = $recordHandler;
    }

    /**
     * @param Record|null $item
     *
     * @param array $context
     * @return Record
     * @throws Exception
     */
    public function __invoke($item, array $context): Record
    {
        $module = $context['args']['module'] ?? '';
        $record = $context['args']['record'] ?? '';

        return $this->recordHandler->getRecord($module, $record);
    }
}
