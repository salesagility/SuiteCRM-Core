<?php

namespace App\ViewDefinitions\Service;

use App\Engine\Service\AclManagerInterface;
use App\Engine\Service\DefinitionEntryHandlingTrait;

/**
 * Class ListViewSidebarWidgetDefinitionProvider
 * @package App\Service
 */
class ListViewSidebarWidgetDefinitionProvider implements ListViewSidebarWidgetDefinitionProviderInterface
{
    use DefinitionEntryHandlingTrait;

    /**
     * @var AclManagerInterface
     */
    protected $aclManager;
    /**
     * @var array
     */
    private $widgets;

    /**
     * ListViewSidebarWidgetDefinitionProvider constructor.
     * @param array $listViewSidebarWidgets
     * @param AclManagerInterface $aclManager
     */
    public function __construct(array $listViewSidebarWidgets, AclManagerInterface $aclManager)
    {
        $this->widgets = $listViewSidebarWidgets;
        $this->aclManager = $aclManager;
    }

    /**
     * @inheritDoc
     */
    public function getSidebarWidgets(string $module): array
    {
        $widgets = $this->filterDefinitionEntries($module, 'widgets', $this->widgets, $this->aclManager);

        foreach ($widgets as $index => $widget) {
            $widgets[$index]['refreshOnRecordUpdate'] = $widget['refreshOnRecordUpdate'] ?? true;
        }

        return array_values($widgets);
    }
}
