<?php

namespace App\Service;

use App\UserPreferences\Entity\UserPreference;

interface UserPreferencesProviderInterface
{

    /**
     * Get all exposed user preferences
     * @return UserPreference[]
     */
    public function getAllUserPreferences(): array;

    /**
     * Get user preference
     * @param string $key
     * @return UserPreference|null
     */
    public function getUserPreference(string $key): ?UserPreference;
}
