<?php

namespace App\Service;

class ActionDefinitionProvider
{
    /**
     * @var AclManagerInterface
     */
    protected $aclManager;

    /**
     * BulkActionDefinitionProvider constructor.
     * @param AclManagerInterface $aclManager
     */
    public function __construct(AclManagerInterface $aclManager)
    {
        $this->aclManager = $aclManager;
    }

    /**
     * @param string $module
     * @param array $config
     * @return array
     */
    public function filterActions(string $module, array &$config): array
    {
        $defaults = $config['default'];
        $defaultActions = $defaults['actions'] ?? [];
        $modulesConfig = $config['modules'] ?? [];
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
