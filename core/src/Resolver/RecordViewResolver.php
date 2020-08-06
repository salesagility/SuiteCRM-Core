<?php

namespace App\Resolver;

use ApiPlatform\Core\GraphQl\Resolver\QueryItemResolverInterface;
use App\Entity\RecordView;
use Exception;
use SuiteCRM\Core\Legacy\RecordViewHandler;

class RecordViewResolver implements QueryItemResolverInterface
{
    /**
     * @var RecordViewHandler
     */
    protected $recordViewHandler;

    /**
     * RecordViewResolver constructor.
     * @param RecordViewHandler $recordViewHandler
     */
    public function __construct(RecordViewHandler $recordViewHandler)
    {
        $this->recordViewHandler = $recordViewHandler;
    }

    /**
     * @param RecordView|null $item
     *
     * @param array $context
     * @return RecordView
     * @throws Exception
     */
    public function __invoke($item, array $context): RecordView
    {

        $module = $context['args']['module'] ?? '';
        $record = $context['args']['record'] ?? '';

        return $this->recordViewHandler->getRecord($module, $record);
    }
}
