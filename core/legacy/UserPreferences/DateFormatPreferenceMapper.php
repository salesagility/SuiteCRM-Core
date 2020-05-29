<?php

namespace SuiteCRM\Core\Legacy\UserPreferences;

use SuiteCRM\Core\Legacy\DateTimeHandler;

class DateFormatPreferenceMapper implements UserPreferencesMapperInterface
{

    /**
     * @var DateTimeHandler
     */
    private $dateTimeHandler;

    /**
     * DateFormatPreferenceMapper constructor.
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
        return 'datef';
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
