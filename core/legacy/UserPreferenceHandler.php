<?php

namespace App\Legacy;

use ApiPlatform\Core\Exception\ItemNotFoundException;
use App\Entity\UserPreference;
use App\Legacy\UserPreferences\UserPreferencesMappers;
use App\Service\UserPreferencesProviderInterface;
use RuntimeException;
use UnexpectedValueException;
use User;

class UserPreferenceHandler extends LegacyHandler implements UserPreferencesProviderInterface
{
    protected const MSG_USER_PREFERENCE_NOT_FOUND = 'Not able to find user preference key: ';
    public const HANDLER_KEY = 'user-preferences';

    /**
     * @var array
     */
    protected $exposedUserPreferences = [];

    /**
     * @var UserPreferencesMappers
     */
    private $mappers;

    /**
     * @var array
     */
    private $userPreferencesKeyMap;

    /**
     * UserPreferenceHandler constructor.
     * @param string $projectDir
     * @param string $legacyDir
     * @param string $legacySessionName
     * @param string $defaultSessionName
     * @param LegacyScopeState $legacyScopeState
     * @param array $exposedUserPreferences
     * @param UserPreferencesMappers $mappers
     * @param array $userPreferencesKeyMap
     */
    public function __construct(
        string $projectDir,
        string $legacyDir,
        string $legacySessionName,
        string $defaultSessionName,
        LegacyScopeState $legacyScopeState,
        array $exposedUserPreferences,
        UserPreferencesMappers $mappers,
        array $userPreferencesKeyMap
    ) {
        parent::__construct($projectDir, $legacyDir, $legacySessionName, $defaultSessionName, $legacyScopeState);

        $this->exposedUserPreferences = $exposedUserPreferences;
        $this->mappers = $mappers;
        $this->userPreferencesKeyMap = $userPreferencesKeyMap;
    }

    /**
     * @inheritDoc
     */
    public function getHandlerKey(): string
    {
        return self::HANDLER_KEY;
    }

    /**
     * Get all exposed user preferences
     * @return array
     */
    public function getAllUserPreferences(): array
    {
        $this->init();

        $this->startLegacyApp();

        $userPreferences = [];

        foreach ($this->exposedUserPreferences as $category => $categoryPreferences) {
            $userPreference = $this->loadUserPreferenceCategory($category);
            if ($userPreference !== null) {
                $userPreferences[] = $userPreference;
            }
        }

        $this->close();

        return $userPreferences;
    }

    /**
     * Load user preference with given $key
     * @param string $category
     * @return UserPreference|null
     */
    protected function loadUserPreferenceCategory(string $category = 'global'): ?UserPreference
    {
        $currentUser = $this->getCurrentUser();

        if (empty($category)) {
            return null;
        }

        if (!isset($currentUser->id)) {
            throw new RuntimeException('No user logged in.');
        }

        if (!isset($this->exposedUserPreferences[$category])) {

            throw new ItemNotFoundException(self::MSG_USER_PREFERENCE_NOT_FOUND . "'$category'");
        }

        $userPreference = new UserPreference();
        $userPreference->setId($category);

        if (!is_array($this->exposedUserPreferences[$category]) || empty($this->exposedUserPreferences[$category])) {
            return $userPreference;
        }

        $items = [];
        foreach ($this->exposedUserPreferences[$category] as $key => $value) {

            $value = $this->loadUserPreference($key, $category);
            $value = $this->mapValue($key, $value);
            $key = $this->mapKey($key);
            $items[$key] = $value;
        }

        $userPreference->setItems($items);

        return $userPreference;
    }

    /**
     * Get currently logged in user
     * @return User
     */
    protected function getCurrentUser(): User
    {
        global $current_user;

        if ($current_user === null) {
            throw new UnexpectedValueException('Current user is not loaded');
        }

        return $current_user;
    }

    /**
     * Load user preference with given $key
     * @param string $key
     * @param string $category
     * @return mixed|null
     */
    protected function loadUserPreference(string $key, string $category = 'global')
    {
        if (empty($key)) {
            return null;
        }

        if (!isset($this->exposedUserPreferences[$category]) &&
            !isset($this->exposedUserPreferences[$category][$key])) {

            throw new ItemNotFoundException(self::MSG_USER_PREFERENCE_NOT_FOUND . "'$key'");
        }

        $currentUser = $this->getCurrentUser();
        $preference = $currentUser->getPreference($key, $category);

        if (empty($preference)) {
            return $preference;
        }

        if (is_array($preference)) {
            $items = $preference;

            if (is_array($this->exposedUserPreferences[$category][$key])) {
                $items = $this->filterItems($preference, $this->exposedUserPreferences[$category][$key]);
            }

            return $items;
        }

        return $preference;
    }

    /**
     * Filter to retrieve only exposed items
     * @param array $allItems
     * @param array $exposed
     * @return array
     */
    protected function filterItems(array $allItems, array $exposed): array
    {
        $filteredItems = [];

        if (empty($exposed)) {
            return $filteredItems;
        }

        foreach ($allItems as $key => $value) {

            if (!isset($exposed[$key])) {
                continue;
            }

            if (is_array($allItems[$key])) {

                $subItems = $allItems[$key];

                if (is_array($exposed[$key])) {

                    $subItems = $this->filterItems($allItems[$key], $exposed[$key]);
                }

                $filteredItems[$key] = $subItems;

                continue;
            }

            $filteredItems[$key] = $value;
        }

        return $filteredItems;
    }

    /**
     * Map user preference value if mapper defined
     * @param string $key
     * @param $preference
     * @return mixed
     */
    protected function mapValue(string $key, $preference)
    {
        if ($this->mappers->hasMapper($key)) {
            $mapper = $this->mappers->get($key);
            $preference = $mapper->map($preference);
        }

        return $preference;
    }

    /**
     * Map user preference key if mapper defined
     * @param string $key
     * @return mixed
     */
    protected function mapKey(string $key)
    {
        if ($key === null) {
            return $key;
        }

        return $this->userPreferencesKeyMap[$key] ?? $key;
    }

    /**
     * Get user preference
     * @param string $key
     * @return UserPreference|null
     */
    public function getUserPreference(string $key): ?UserPreference
    {
        $this->init();

        $this->startLegacyApp();

        $userPreference = $this->loadUserPreferenceCategory($key);

        $this->close();

        return $userPreference;
    }
}
