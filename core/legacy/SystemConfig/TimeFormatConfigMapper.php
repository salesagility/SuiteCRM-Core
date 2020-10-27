<?php

namespace App\Legacy\SystemConfig;

use App\Entity\SystemConfig;
use App\Legacy\DateTimeHandler;

class TimeFormatConfigMapper implements SystemConfigMapperInterface
{
    /**
     * @var DateTimeHandler
     */
    private $dateTimeHandler;

    /**
     * TimeFormatConfigMapper constructor.
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
    public function map(SystemConfig $config): void
    {
        if (empty($config->getValue())) {
            return;
        }

        $format = $this->dateTimeHandler->mapFormat($config->getValue());
        $config->setValue($format);
    }
}
