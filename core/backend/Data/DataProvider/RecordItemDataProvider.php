<?php

namespace App\Data\DataProvider;

use ApiPlatform\Core\DataProvider\ItemDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use App\Data\Entity\Record;
use App\Data\Service\RecordProviderInterface;
use Exception;

/**
 * Class RecordItemDataProvider
 */
final class RecordItemDataProvider implements ItemDataProviderInterface, RestrictedDataProviderInterface
{
    /**
     * @var RecordProviderInterface
     */
    private $recordHandler;

    /**
     * RecordViewItemDataProvider constructor.
     * @param RecordProviderInterface $recordHandler
     */
    public function __construct(RecordProviderInterface $recordHandler)
    {
        $this->recordHandler = $recordHandler;
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
        return Record::class === $resourceClass;
    }

    /**
     * Get get record by id
     * @param string $resourceClass
     * @param array|int|string $id
     * @param string|null $operationName
     * @param array $context
     * @return Record|null
     * @throws Exception
     */
    public function getItem(
        string $resourceClass,
        $id,
        string $operationName = null,
        array $context = []
    ): ?Record {
        $module = '';

        if (!empty($context['args']['module'])) {
            $module = $context['args']['module'];
        } elseif (!empty($context['filters']['module'])) {
            $module = $context['filters']['module'];
        }

        return $this->recordHandler->getRecord($module, $id);
    }
}
