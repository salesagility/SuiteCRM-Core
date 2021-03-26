<?php

namespace App\Process\Service;

interface BulkActionDefinitionProviderInterface
{

    /**
     * Get list of bulk actions for module
     * @param string $module
     * @return array
     */
    public function getBulkActions(string $module): array;
}
