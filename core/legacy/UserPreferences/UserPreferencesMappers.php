<?php

namespace App\Legacy\UserPreferences;

use ApiPlatform\Core\Exception\ItemNotFoundException;

class UserPreferencesMappers
{
    protected const MSG_HANDLER_NOT_FOUND = 'UserPreference mapper is not defined';

    /**
     * @var UserPreferencesMapperInterface[]
     */
    protected $registry = [];

    /**
     * UserPreferencesMappers constructor.
     * @param iterable $handlers
     */
    public function __construct(iterable $handlers)
    {
        /**
         * @var UserPreferencesMapperInterface[]
         */
        $handlers = iterator_to_array($handlers);

        foreach ($handlers as $handler) {
            $type = $handler->getKey();
            $this->registry[$type] = $handler;
        }

    }

    /**
     * Get the mapper for the given key
     * @param string $userPreferenceKey
     * @return UserPreferencesMapperInterface
     */
    public function get(string $userPreferenceKey): UserPreferencesMapperInterface
    {

        if (empty($this->registry[$userPreferenceKey])) {
            throw new ItemNotFoundException(self::MSG_HANDLER_NOT_FOUND);
        }

        return $this->registry[$userPreferenceKey];
    }

    /**
     * Has mapper for the given key
     * @param string $userPreferenceKey
     * @return bool
     */
    public function hasMapper(string $userPreferenceKey): bool
    {
        if (empty($this->registry[$userPreferenceKey])) {
            return false;
        }

        return true;
    }
}
