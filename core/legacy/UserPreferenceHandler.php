<?php

namespace SuiteCRM\Core\Legacy;

use ApiPlatform\Core\Exception\ItemNotFoundException;
use App\Entity\UserPreference;
use DBManagerFactory;

use Exception;

class UserPreferenceHandler extends LegacyHandler
{
    protected const MSG_USER_PREFERENCE_NOT_FOUND = 'Not able to find user preference key: ';

    /**
     * @var array
     */
    protected $exposedUserPreferences = [];

    /**
     * @var User
     */
    protected $current_user = null;

    /**
     *
     * @var array
     */
    protected $userPreference = [];
    
    /**
     * UserPreferenceHandler constructor.
     * @param string $projectDir
     * @param string $legacyDir
     * @param string $legacySessionName
     * @param string $defaultSessionName
     * @param array $exposedUserPreferences
     */
    public function __construct(
        string $projectDir,
        string $legacyDir,
        string $legacySessionName,
        string $defaultSessionName,
        array $exposedUserPreferences
    ) {
        parent::__construct($projectDir, $legacyDir, $legacySessionName, $defaultSessionName);

        $this->init();

        $this->exposedUserPreferences = $exposedUserPreferences;

        global $current_user;
        get_sugar_config_defaults();

        $user = new \User();
        $current_user = $user->retrieve(1);

        $db = DBManagerFactory::getInstance();

        $quotedUserId = $db->quoted($current_user->id);
        $result = $db->query("SELECT contents, category FROM user_preferences WHERE assigned_user_id=" . $quotedUserId . " AND deleted = 0", false, 'Failed to load user preferences');

        while ($row = $db->fetchByAssoc($result)) {
            $category = $row['category'];
            $this->preferences[$category] = unserialize(base64_decode($row['contents']));
        }

        $this->close();
    }

    /**
     * Get all exposed user preferences
     * @return array
     */
    public function getAllUserPreferences(): array
    {
        $this->init();

        $userPreferences = [];

        foreach ($this->exposedUserPreferences as $key => $value) {
            $userPreference = $this->loadUserPreference($key);
            if (!empty($userPreference)) {
                $userPreferences[] = $userPreference;
            }
        }

        $this->close();

        return $userPreferences;
    }

    /**
     * Get user preference
     * @param string $key
     * @return UserPreference|null
     */
    public function getUserPreference(string $key): ?UserPreference
    {
        $this->init();

        $userPreference = $this->loadUserPreference($key);

        $this->close();

        return $userPreference;
    }

    /**
     * Load user preference with given $key
     * @param $key
     * @return UserPreference|null
     */
    protected function loadUserPreference(string $key): ?UserPreference
    {
        global $current_user;

        if (empty($key)) {
            return null;
        }

        if (!isset($current_user->id)) {
            throw new Exception('No user logged in.');
        }


        if (!isset($this->preferences[$key])) {
            throw new ItemNotFoundException(self::MSG_USER_PREFERENCE_NOT_FOUND . "'$key'");
        }

        $userPreference = new UserPreference();
        $userPreference->setId($key);

        if (!isset($this->preferences[$key])) {
            return $userPreference;
        }

        if (is_array($this->preferences[$key])) {
            $items = $this->preferences[$key];

            if (is_array($this->exposedUserPreferences[$key])) {
                $items = $this->filterItems($this->preferences[$key], $this->exposedUserPreferences[$key]);
            }

            $userPreference->setItems($items);

            return $userPreference;
        }

        $userPreference->setValue($this->preferences[$key]);

        return $userPreference;
    }

    /**
     * Filter to retrieve only exposed items
     * @param array $allItems
     * @param array $exposed
     * @return array
     */
    protected function filterItems(array $allItems, array $exposed): array
    {
        $items = [];

        if (empty($exposed)) {
            return $items;
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

                $items[$key] = $subItems;

                continue;
            }

            $items[$key] = $value;
        }

        return $items;
    }
}