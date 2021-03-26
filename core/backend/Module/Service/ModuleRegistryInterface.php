<?php

namespace App\Module\Service;

interface ModuleRegistryInterface
{
    /**
     * Get list of modules the user has access to
     * @return array list of module names
     */
    public function getUserAccessibleModules(): array;
}
