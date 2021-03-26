<?php

namespace App\Process\Service\RecordActions;

use ApiPlatform\Core\Exception\InvalidArgumentException;
use App\Process\Entity\Process;
use App\Module\Service\ModuleNameMapperInterface;
use App\Process\Service\ProcessHandlerInterface;

class DuplicateRecordAction implements ProcessHandlerInterface
{
    protected const MSG_OPTIONS_NOT_FOUND = 'Process options are not defined';
    protected const PROCESS_TYPE = 'record-duplicate';

    /**
     * @var ModuleNameMapperInterface
     */
    private $moduleNameMapper;

    /**
     * MergeRecordsBulkAction constructor.
     * @param ModuleNameMapperInterface $moduleNameMapper
     */
    public function __construct(ModuleNameMapperInterface $moduleNameMapper)
    {
        $this->moduleNameMapper = $moduleNameMapper;
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

        if (empty($options['id'])) {
            throw new InvalidArgumentException(self::MSG_OPTIONS_NOT_FOUND);
        }
    }

    /**
     * @inheritDoc
     */
    public function run(Process $process)
    {
        $options = $process->getOptions();

        $responseData = [
            'handler' => 'redirect',
            'params' => [
                'route' => $options['module'] . '/duplicate/' . $options['id'],
                'queryParams' => [
                    'isDuplicate' => true,
                    'return_module' => $this->moduleNameMapper->toLegacy($options['module']),
                    'return_action' => 'DetailView',
                    'return_id' => $options['id'],
                ]
            ]
        ];

        $process->setStatus('success');
        $process->setMessages([]);
        $process->setData($responseData);
    }
}
