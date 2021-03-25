<?php

namespace App\SystemConfig\LegacyHandler;

use App\Entity\SystemConfig;

interface SystemConfigMapperInterface
{
    /**
     * Get the System Config Key
     * @return string
     */
    public function getKey(): string;

    /**
     * Map value
     * @param SystemConfig $systemConfig
     * @return mixed
     */
    public function map(SystemConfig $systemConfig): void;
}
