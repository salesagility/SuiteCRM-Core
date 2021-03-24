<?php

namespace App\Service;

trait DefinitionEntryHandlingTrait
{
    /**
     * @param string $module
     * @param string $entryName
     * @param array $config
     * @param AclManagerInterface $aclManager
     * @return array
     */
    public function filterDefinitionEntries(
        string $module,
        string $entryName,
        array &$config,
        AclManagerInterface $aclManager
    ): array {
        $defaults = $config['default'] ?? [];
        $defaultEntries = $defaults[$entryName] ?? [];
        $modulesConfig = $config['modules'] ?? [];
        $moduleEntryConfig = $modulesConfig[$module] ?? [];
        $exclude = $moduleEntryConfig['exclude'] ?? [];
        $moduleEntries = $moduleEntryConfig[$entryName] ?? [];

        $entries = array_merge($defaultEntries, $moduleEntries);
        $filteredEntries = [];

        foreach ($entries as $entryKey => $entry) {

            if (in_array($entryKey, $exclude, true)) {
                continue;
            }

            if ($this->checkAccess($module, $entry['acl'] ?? [], $aclManager) === false) {
                continue;
            }

            $filteredEntries[$entryKey] = $entry;
        }

        return $filteredEntries;
    }

    /**
     * Check access
     *
     * @param string $module
     * @param array $aclList
     * @param AclManagerInterface $aclManager
     * @return bool
     */
    public function checkAccess(string $module, array $aclList, AclManagerInterface $aclManager): bool
    {
        if (empty($aclList)) {
            return true;
        }

        foreach ($aclList as $acl) {
            if ($aclManager->checkAccess($module, $acl, true) === false) {
                return false;
            }
        }

        return true;
    }
}
