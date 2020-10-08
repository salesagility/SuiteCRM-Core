<?php

namespace SuiteCRM\Core\Legacy\Data;

use ApiPlatform\Core\Exception\ItemNotFoundException;

class PresetListDataHandlers
{
    protected const MSG_HANDLER_NOT_FOUND = 'PresetListData handler is not defined';

    /**
     * @var PresetListDataHandlerInterface[]
     */
    protected $registry = [];

    /**
     * PresetListDataHandlers constructor.
     * @param iterable $handlers
     */
    public function __construct(iterable $handlers)
    {
        foreach ($handlers as $handler) {
            $type = $handler->getType();
            $this->registry[$type] = $handler;
        }

    }

    /**
     * Get the handler for a given type
     * @param string $type
     * @return PresetListDataHandlerInterface
     */
    public function get(string $type): PresetListDataHandlerInterface
    {
        if (!isset($this->registry[$type])) {
            throw new ItemNotFoundException(self::MSG_HANDLER_NOT_FOUND);
        }

        return $this->registry[$type];
    }

    /**
     * Has mapper for the given key
     * @param string $type
     * @return bool
     */
    public function hasMapper(string $type): bool
    {
        return isset($this->registry[$type]);
    }
}
