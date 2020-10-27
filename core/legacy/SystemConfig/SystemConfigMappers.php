<?php

namespace App\Legacy\SystemConfig;

use ApiPlatform\Core\Exception\ItemNotFoundException;

class SystemConfigMappers
{
    protected const MSG_HANDLER_NOT_FOUND = 'SystemConfig mapper is not defined';

    /**
     * @var SystemConfigMapperInterface[]
     */
    protected $registry = [];

    /**
     * SystemConfigMappers constructor.
     * @param iterable $handlers
     */
    public function __construct(iterable $handlers)
    {
        /**
         * @var SystemConfigMapperInterface[]
         */
        $handlers = iterator_to_array($handlers);

        foreach ($handlers as $handler) {
            $type = $handler->getKey();
            $this->registry[$type] = $handler;
        }

    }

    /**
     * Get the mapper for the given key
     * @param string $systemConfigKey
     * @return SystemConfigMapperInterface
     */
    public function get(string $systemConfigKey): SystemConfigMapperInterface
    {

        if (empty($this->registry[$systemConfigKey])) {
            throw new ItemNotFoundException(self::MSG_HANDLER_NOT_FOUND);
        }

        return $this->registry[$systemConfigKey];
    }

    /**
     * Has mapper for the given key
     * @param string $systemConfigKey
     * @return bool
     */
    public function hasMapper(string $systemConfigKey): bool
    {
        if (empty($this->registry[$systemConfigKey])) {
            return false;
        }

        return true;
    }
}
