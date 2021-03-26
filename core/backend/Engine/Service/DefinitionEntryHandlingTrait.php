<?php
/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2021 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */


namespace App\Engine\Service;

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
