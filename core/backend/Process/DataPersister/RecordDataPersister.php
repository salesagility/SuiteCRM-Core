<?php

namespace App\Process\DataPersister;

use ApiPlatform\Core\DataPersister\ContextAwareDataPersisterInterface;
use ApiPlatform\Core\Exception\InvalidResourceException;
use App\Data\Entity\Record;
use App\Service\RecordProviderInterface;

class RecordDataPersister implements ContextAwareDataPersisterInterface
{
    /**
     * @var RecordProviderInterface
     */
    private $recordProvider;

    /**
     * RecordDataPersister constructor.
     * @param RecordProviderInterface $recordProvider
     */
    public function __construct(RecordProviderInterface $recordProvider)
    {
        $this->recordProvider = $recordProvider;
    }

    /**
     * @inheritDoc
     */
    public function supports($data, array $context = []): bool
    {
        return $data instanceof Record;
    }

    /**
     * Handle Process create / update request
     * @param Record $record
     * @param array $context
     * @return Record
     */
    public function persist($record, array $context = []): Record
    {
        return $this->recordProvider->saveRecord($record);
    }

    /**
     * Handler process deletion request
     * @param $data
     * @param array $context
     * @throws InvalidResourceException
     */
    public function remove($data, array $context = []): void
    {
        // Deleting processes is not supported
        throw new InvalidResourceException('invalid operation');
    }
}
