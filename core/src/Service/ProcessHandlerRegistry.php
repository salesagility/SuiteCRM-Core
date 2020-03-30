<?php


namespace App\Service;

use ApiPlatform\Core\Exception\ItemNotFoundException;

class ProcessHandlerRegistry
{
    protected const MSG_HANDLER_NOT_FOUND = 'Process is not defined';

    /**
     * @var ProcessHandlerInterface[]
     */
    protected $registry = [];

    /**
     * ProcessHandlerRegistry constructor.
     * @param iterable $handlers
     */
    public function __construct(iterable $handlers)
    {
        /**
         * @var ProcessHandlerInterface[]
         */
        $handlers = iterator_to_array($handlers);

        foreach ($handlers as $handler) {
            $type = $handler->getProcessType();
            $this->registry[$type] = $handler;
        }

    }

    /**
     * @param String $processKey
     * @param ProcessHandlerInterface $handler
     */
    public function register(String $processKey, ProcessHandlerInterface $handler): void
    {
        $this->registry[$processKey] = $handler;
    }

    /**
     * Get the process handler for the given key
     * @param string $processKey
     * @return ProcessHandlerInterface
     */
    public function get(string $processKey): ProcessHandlerInterface
    {

        if (empty($this->registry[$processKey])) {
            throw new ItemNotFoundException(self::MSG_HANDLER_NOT_FOUND);
        }

        return $this->registry[$processKey];
    }
}