<?php

namespace App\Legacy\SystemConfig;

use App\Entity\SystemConfig;
use App\Legacy\CurrencyHandler;

class DefaultCurrencyConfigMapper implements SystemConfigMapperInterface
{
    /**
     * @var CurrencyHandler
     */
    private $currencyHandler;

    /**
     * DefaultCurrencyConfigMapper constructor.
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
    public function map(SystemConfig $config): void
    {
        $id = $config->getValue();

        $currency = $this->currencyHandler->getCurrency($id);
        $config->setValue(null);
        $config->setItems($currency);
    }
}
