<?php

namespace App\Service;

class BulkActionDefinitionProvider extends ActionDefinitionProvider implements BulkActionDefinitionProviderInterface
{
    /**
     * @var array
     */
    private $listViewBulkActions;

    /**
     * BulkActionDefinitionProvider constructor.
     * @param array $listViewBulkActions
     * @param AclManagerInterface $aclManager
     */
    public function __construct(array $listViewBulkActions, AclManagerInterface $aclManager)
    {
        parent::__construct($aclManager);
        $this->listViewBulkActions = $listViewBulkActions;
    }

    /**
     * @inheritDoc
     */
    public function getBulkActions(string $module): array
    {
        return $this->filterActions($module, $this->listViewBulkActions);
    }
}
