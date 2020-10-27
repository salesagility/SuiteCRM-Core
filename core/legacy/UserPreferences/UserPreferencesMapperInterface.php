<?php

namespace App\Legacy\UserPreferences;

interface UserPreferencesMapperInterface
{
    /**
     * Get the User Preference Key
     * @return string
     */
    public function getKey(): string;

    /**
     * Map value
     * @param mixed $value
     * @return mixed
     */
    public function map($value);
}
