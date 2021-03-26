<?php

namespace App\SystemConfig\Service;

use App\SystemConfig\Entity\SystemConfig;

interface SystemConfigProviderInterface
{

    /**
     * Get all exposed system configs
     * @return array
     */
    public function getAllSystemConfigs(): array;

    /**
     * Get system config
     * @param string $configKey
     * @return SystemConfig|null
     */
    public function getSystemConfig(string $configKey): ?SystemConfig;
}
