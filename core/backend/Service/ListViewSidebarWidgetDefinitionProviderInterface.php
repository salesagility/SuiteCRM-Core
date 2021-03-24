<?php

namespace App\Service;

/**
 * Interface ListViewSidebarWidgetDefinitionProviderInterface
 * @package App\Service
 */
interface ListViewSidebarWidgetDefinitionProviderInterface
{

    /**
     * Get list of list view sidebar widgets for module
     * @param string $module
     * @return array
     */
    public function getSidebarWidgets(string $module): array;
}
