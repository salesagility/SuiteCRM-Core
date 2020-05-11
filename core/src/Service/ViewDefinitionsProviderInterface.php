<?php

namespace App\Service;

use App\Entity\ViewDefinition;

interface ViewDefinitionsProviderInterface
{

    /**
     * Get list-view defs
     * @param string $moduleName
     * @return ViewDefinition
     */
    public function getListViewDef(string $moduleName): ViewDefinition;
}
