<?php

namespace App\UserPreferences\LegacyHandler;

use App\DateTime\LegacyHandler\DateTimeHandler;

class TimeFormatPreferenceMapper implements UserPreferencesMapperInterface
{

    /**
     * @var DateTimeHandler
     */
    private $dateTimeHandler;

    /**
     * TimeFormatPreferenceMapper constructor.
     * @param DateTimeHandler $dateTimeHandler
     */
    public function __construct(DateTimeHandler $dateTimeHandler)
    {

        $this->dateTimeHandler = $dateTimeHandler;
    }

    /**
     * @inheritDoc
     */
    public function getKey(): string
    {
        return 'timef';
    }

    /**
     * @inheritDoc
     */
    public function map($value)
    {
        if (empty($value)) {
            return $value;
        }

        return $this->dateTimeHandler->mapFormat($value);
    }
}
