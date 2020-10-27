<?php

namespace App\Legacy\UserPreferences;

use App\Legacy\CurrencyHandler;

class CurrencyPreferenceMapper implements UserPreferencesMapperInterface
{
    /**
     * @var CurrencyHandler
     */
    private $currencyHandler;

    /**
     * CurrencyPreferenceMapper constructor.
     * @param CurrencyHandler $currencyHandler
     */
    public function __construct(CurrencyHandler $currencyHandler)
    {
        $this->currencyHandler = $currencyHandler;
    }

    /**
     * @inheritDoc
     */
    public function getKey(): string
    {
        return 'currency';
    }

    /**
     * @inheritDoc
     */
    public function map($value)
    {
        return $this->currencyHandler->getCurrency($value);
    }
}
