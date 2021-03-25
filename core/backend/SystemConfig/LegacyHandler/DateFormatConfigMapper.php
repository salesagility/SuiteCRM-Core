<?php

namespace App\SystemConfig\LegacyHandler;

use App\SystemConfig\Entity\SystemConfig;
use App\DateTime\LegacyHandler\DateTimeHandler;

class DateFormatConfigMapper implements SystemConfigMapperInterface
{
    /**
     * @var DateTimeHandler
     */
    private $dateTimeHandler;

    /**
     * DateFormatConfigMapper constructor.
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
    public function map(SystemConfig $config): void
    {
        if (empty($config->getValue())) {
            return;
        }

        $format = $this->dateTimeHandler->mapFormat($config->getValue());
        $config->setValue($format);
    }
}
