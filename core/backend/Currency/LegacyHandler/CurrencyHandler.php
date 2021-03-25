<?php

namespace App\Currency\LegacyHandler;

use App\Engine\LegacyHandler\LegacyHandler;
use BeanFactory;
use Currency;

class CurrencyHandler extends LegacyHandler
{
    public const HANDLER_KEY = 'currency';

    /**
     * @inheritDoc
     */
    public function getHandlerKey(): string
    {
        return self::HANDLER_KEY;
    }

    /**
     * Get currency info array
     * @param string $currencyId
     * @return array
     */
    public function getCurrency(?string $currencyId): array
    {
        $this->init();

        $id = -99;
        if (!empty($currencyId)) {
            $id = $currencyId;
        }

        $info = [];

        /** @var Currency $currency */
        $currency = BeanFactory::getBean('Currencies', $id);
        $info['id'] = $currency->id;
        $info['name'] = $currency->name;
        $info['symbol'] = html_entity_decode($currency->symbol);
        $info['iso4217'] = $currency->iso4217;

        $this->close();

        return $info;
    }
}
