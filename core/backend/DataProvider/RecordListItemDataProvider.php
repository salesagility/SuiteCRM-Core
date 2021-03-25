<?php

namespace App\DataProvider;

use ApiPlatform\Core\DataProvider\ItemDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use App\Data\LegacyHandler\RecordListHandler;
use App\Entity\RecordList;
use Exception;

/**
 * Class RecordListItemDataProvider
 * @package App\DataProvider
 */
class RecordListItemDataProvider implements ItemDataProviderInterface, RestrictedDataProviderInterface
{
    /**
     * @var RecordListHandler
     */
    protected $recordListHandler;

    /**
     * RecordListItemDataProvider constructor.
     * @param RecordListHandler $recordListHandler
     */
    public function __construct(RecordListHandler $recordListHandler)
    {
        $this->recordListHandler = $recordListHandler;
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
        return RecordList::class === $resourceClass;
    }

    /**
     * @param string $resourceClass
     * @param array|int|string $id
     * @param string|null $operationName
     * @param array $context
     * @return RecordList|null
     * @throws Exception
     */
    public function getItem(
        string $resourceClass,
        $id,
        string $operationName = null,
        array $context = []
    ): ?RecordList {
        return $this->recordListHandler->getList($id);
    }
}
