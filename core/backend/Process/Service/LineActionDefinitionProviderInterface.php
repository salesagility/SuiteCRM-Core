<?php

namespace App\Process\Service;

interface LineActionDefinitionProviderInterface
{

    /**
     * Get list of line actions for module
     * @param string $module
     * @return array
     */
    public function getLineActions(string $module): array;
}
