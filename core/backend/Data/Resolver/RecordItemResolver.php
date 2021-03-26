<?php

namespace App\Data\Resolver;

use ApiPlatform\Core\GraphQl\Resolver\QueryItemResolverInterface;
use App\Data\Entity\Record;
use App\Service\RecordProviderInterface;
use Exception;

class RecordItemResolver implements QueryItemResolverInterface
{
    /**
     * @var RecordProviderInterface
     */
    protected $recordHandler;

    /**
     * RecordViewResolver constructor.
     * @param RecordProviderInterface $recordHandler
     */
    public function __construct(RecordProviderInterface $recordHandler)
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
