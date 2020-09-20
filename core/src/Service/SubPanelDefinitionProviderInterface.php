<?php

namespace App\Service;

use Exception;

interface SubPanelDefinitionProviderInterface
{

    /**
     * Get sub panel defs
     * @param string $moduleName
     * @return array
     * @throws Exception
     */
    public function getSubPanelDef(string $moduleName): array;
}
