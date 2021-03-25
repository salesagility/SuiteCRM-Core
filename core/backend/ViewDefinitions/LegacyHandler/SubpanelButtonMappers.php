<?php

namespace App\ViewDefinitions\LegacyHandler;

use App\Service\ModuleAwareRegistry;

class SubpanelButtonMappers extends ModuleAwareRegistry
{
    /**
     * @var SubpanelButtonMapperInterface[][]
     */
    protected $registry;

    /**
     * Get the mappers for the module key
     * @param string $module
     * @return SubpanelButtonMapperInterface[]
     */
    public function get(string $module): array
    {
        return $this->retrieve($module);
    }
}
