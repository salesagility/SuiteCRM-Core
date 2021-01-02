<?php

namespace App\Legacy\Data\FilterMapper;

use ApiPlatform\Core\Exception\ItemNotFoundException;

class FilterMappers
{
    protected const MSG_HANDLER_NOT_FOUND = 'Filter mapper is not defined';

    /**
     * @var FilterMapperInterface[]
     */
    protected $registry = [];

    /**
     * FilterMappers constructor.
     * @param iterable $handlers
     */
    public function __construct(iterable $handlers)
    {
        /**
         * @var FilterMapperInterface[]
         */
        $handlers = iterator_to_array($handlers);

        foreach ($handlers as $handler) {
            $type = $handler->getType();
            $this->registry[$type] = $handler;
        }

    }

    /**
     * Get the mapper for field type
     * @param string $type
     * @return FilterMapperInterface
     * @throws ItemNotFoundException
     */
    public function get(string $type): FilterMapperInterface
    {

        if (empty($this->registry[$type])) {
            throw new ItemNotFoundException(self::MSG_HANDLER_NOT_FOUND);
        }

        return $this->registry[$type];
    }

    /**
     * Has mapper for the given type
     * @param string $type
     * @return bool
     */
    public function hasMapper(string $type): bool
    {
        return !(empty($this->registry[$type]));
    }
}
