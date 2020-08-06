<?php

namespace App\DataProvider;

use ApiPlatform\Core\DataProvider\ItemDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use App\Entity\RecordView;
use App\Service\RecordViewProviderInterface;
use Exception;

/**
 * Class RecordViewItemDataProvider
 */
final class RecordViewItemDataProvider implements ItemDataProviderInterface, RestrictedDataProviderInterface
{
    /**
     * @var RecordViewProviderInterface
     */
    private $recordViewHandler;

    /**
     * RecordViewItemDataProvider constructor.
     * @param RecordViewProviderInterface $recordViewHandler
     */
    public function __construct(RecordViewProviderInterface $recordViewHandler)
    {
        $this->recordViewHandler = $recordViewHandler;
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
        return RecordView::class === $resourceClass;
    }

    /**
     * Get get record by id
     * @param string $resourceClass
     * @param array|int|string $id
     * @param string|null $operationName
     * @param array $context
     * @return RecordView|null
     * @throws Exception
     */
    public function getItem(
        string $resourceClass,
        $id,
        string $operationName = null,
        array $context = []
    ): ?RecordView {
        return $this->recordViewHandler->getRecord($id);
    }
}
