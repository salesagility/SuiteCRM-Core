<?php

namespace App\Service\RecordActions;

use ApiPlatform\Core\Exception\InvalidArgumentException;
use App\Entity\Process;
use App\Service\ModuleNameMapperInterface;
use App\Service\ProcessHandlerInterface;
use App\Service\RecordDeletionServiceInterface;

class DeleteRecordAction implements ProcessHandlerInterface
{
    protected const MSG_OPTIONS_NOT_FOUND = 'Process options are not defined';

    protected const PROCESS_TYPE = 'record-delete';

    /**
     * @var ModuleNameMapperInterface
     */
    private $moduleNameMapper;

    /**
     * @var RecordDeletionServiceInterface
     */
    private $recordDeletionProvider;

    /**
     * DeleteRecordsBulkAction constructor.
     * @param ModuleNameMapperInterface $moduleNameMapper
     * @param RecordDeletionServiceInterface $recordDeletionProvider
     */
    public function __construct(
        ModuleNameMapperInterface $moduleNameMapper,
        RecordDeletionServiceInterface $recordDeletionProvider
    ) {
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

        if (empty($options['module']) || empty($options['action']) || empty($options['id'])) {
            throw new InvalidArgumentException(self::MSG_OPTIONS_NOT_FOUND);
        }
    }

    /**
     * @inheritDoc
     */
    public function run(Process $process)
    {
        $result = $this->deleteRecord($process);

        $process->setStatus('success');
        $process->setMessages(['LBL_RECORD_DELETE_SUCCESS']);
        if (!$result) {
            $process->setStatus('error');
            $process->setMessages(['LBL_ACTION_ERROR']);

            return;
        }

        $options = $process->getOptions();

        $responseData = [
            'handler' => 'redirect',
            'params' => [
                'route' => $options['module'],
                'queryParams' => []
            ]
        ];

        $process->setData($responseData);
    }

    /**
     * @param Process $process
     * @return bool
     */
    protected function deleteRecord(Process $process): bool
    {
        $options = $process->getOptions();

        return $this->recordDeletionProvider->deleteRecord(
            $this->moduleNameMapper->toLegacy($options['module']),
            $options['id']
        );
    }
}
