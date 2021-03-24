<?php

namespace App\Service;

interface RecordActionDefinitionProviderInterface
{
    /**
     * Get list of record actions for module
     * @param string $module
     * @return array
     */
    public function getActions(string $module): array;
}
