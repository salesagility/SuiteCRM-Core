<?php

namespace App\ViewDefinitions\Service;

interface SubPanelDefinitionProviderInterface
{

    /**
     * Get sub panel defs
     * @param string $moduleName
     * @return array
     */
    public function getSubPanelDef(string $moduleName): array;
}
