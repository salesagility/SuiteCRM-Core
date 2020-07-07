<?php

namespace App\Service;

use function in_array;

class BulkActionDefinitionProvider implements BulkActionDefinitionProviderInterface
{
    /**
     * @var array
     */
    private $listViewBulkActions;

    /**
     * @var AclManagerInterface
     */
    private $aclManager;

    /**
     * BulkActionDefinitionProvider constructor.
     * @param array $listViewBulkActions
     * @param AclManagerInterface $aclManager
     */
    public function __construct(array $listViewBulkActions, AclManagerInterface $aclManager)
    {
        $this->listViewBulkActions = $listViewBulkActions;
        $this->aclManager = $aclManager;
    }

    /**
     * @inheritDoc
     */
    public function getBulkActions(string $module): array
    {
        $defaults = $this->listViewBulkActions['default'];
        $defaultActions = $defaults['actions'] ?? [];
        $modulesConfig = $this->listViewBulkActions['modules'] ?? [];
        $moduleActionConfig = $modulesConfig[$module] ?? [];
        $exclude = $moduleActionConfig['exclude'] ?? [];
        $moduleActions = $moduleActionConfig['actions'] ?? [];

        $actions = array_merge($defaultActions, $moduleActions);
        $filterActions = [];

        foreach ($actions as $actionKey => $action) {

            if (in_array($actionKey, $exclude, true)) {
                continue;
            }

            if ($this->checkAccess($module, $action['acl'] ?? []) === false) {
                continue;
            }

            $filterActions[$actionKey] = $action;
        }

        return $filterActions;
    }

    /**
     * Check access
     *
     * @param string $module
     * @param array $aclList
     * @return bool
     */
    public function checkAccess(string $module, array $aclList): bool
    {
        if (empty($aclList)) {
            return true;
        }

        foreach ($aclList as $acl) {
            if ($this->aclManager->checkAccess($module, $acl, true) === false) {
                return false;
            }
        }

        return true;
    }
}