<?php

namespace App\Service\BulkActions;

use ApiPlatform\Core\Exception\InvalidArgumentException;
use App\Entity\Process;
use App\Service\ModuleNameMapperInterface;
use App\Service\ProcessHandlerInterface;
use App\Service\RecordDeletionProviderInterface;
use Psr\Log\LoggerAwareInterface;
use Psr\Log\LoggerInterface;

class DeleteRecordsBulkAction implements ProcessHandlerInterface, LoggerAwareInterface
{
    protected const MSG_OPTIONS_NOT_FOUND = 'Process options is not defined';

    protected const PROCESS_TYPE = 'bulk-delete';

    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @var ModuleNameMapperInterface
     */
    private $moduleNameMapper;

    /**
     * @var RecordDeletionProviderInterface
     */
    private $recordDeletionProvider;

    /**
     * DeleteRecordsBulkAction constructor.
     * @param ModuleNameMapperInterface $moduleNameMapper
     * @param RecordDeletionProviderInterface $recordDeletionProvider
     */
    public function __construct(
        ModuleNameMapperInterface $moduleNameMapper,
        RecordDeletionProviderInterface $recordDeletionProvider
    )
    {
        $this->moduleNameMapper = $moduleNameMapper;
        $this->recordDeletionProvider = $recordDeletionProvider;
    }

    /**
     * @inheritDoc
     */
    public function getProcessType(): string
    {
        return self::PROCESS_TYPE;
    }

    /**
     * @inheritDoc
     */
    public function requiredAuthRole(): string
    {
        return 'ROLE_USER';
    }

    /**
     * @inheritDoc
     */
    public function configure(Process $process): void
    {
        //This process is synchronous
        //We aren't going to store a record on db
        //thus we will use process type as the id
        $process->setId(self::PROCESS_TYPE);
        $process->setAsync(false);
    }

    /**
     * @inheritDoc
     */
    public function validate(Process $process): void
    {
        if (empty($process->getOptions())) {
            throw new InvalidArgumentException(self::MSG_OPTIONS_NOT_FOUND);
        }

        $options = $process->getOptions();

        if (empty($options['module']) || empty($options['action'])) {
            throw new InvalidArgumentException(self::MSG_OPTIONS_NOT_FOUND);
        }
    }

    /**
     * @inheritDoc
     */
    public function run(Process $process)
    {
        $result = $this->deleteRecords($process);

        $responseData = [
            'reload' => true,
        ];

        $process->setStatus('success');
        $process->setMessages(['LBL_BULK_ACTION_DELETE_SUCCESS']);
        if (!$result) {
            $process->setStatus('error');
            $process->setMessages(['LBL_BULK_ACTION_ERROR']);
        }

        $process->setData($responseData);
    }

    /**
     * @param Process $process
     * @return bool
     */
    protected function deleteRecords(Process $process): bool
    {
        $options = $process->getOptions();
        if (is_array($options['ids']) && count($options['ids'])) {
            return $this->recordDeletionProvider->deleteRecords(
                $this->moduleNameMapper->toLegacy($options['module']),
                $options['ids']
            );
        }

        if (is_array($options['criteria'])) {
            $criteria = $options['criteria'];
            $sort = $options['sort'] ?? [];
            return $this->recordDeletionProvider->deleteRecordsFromCriteria(
                $this->moduleNameMapper->toLegacy($options['module']),
                $criteria,
                $sort
            );
        }

        return false;
    }

    /**
     * @inheritDoc
     */
    public function setLogger(LoggerInterface $logger): void
    {
        $this->logger = $logger;
    }
}