<?php


/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2023 SalesAgility Ltd.
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
 * along with this program.  If not, see http://www.gnu.org/licenses.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */

class CacheManager
{


    public function markAsNeedsUpdate($key): void
    {
        global $db;

        if (!empty($GLOBALS['installing']) || isTrue($_REQUEST['post_install'] ?? false)) {
            return;
        }

        $query = "INSERT INTO cache_rebuild (cache_key, rebuild)";
        $query .= " VALUES ('" . $db->quote($key) . "',";
        $query .= "1)";

        $db->query($query, true);
    }

    public function checkIfCacheTableExists(): bool
    {
        global $db;

        if ($db->tableExists('cache_rebuild')) {
            return true;
        }

        $query = "CREATE TABLE cache_rebuild (cache_key varchar(255), rebuild boolean)";
        $result = $db->query($query, true);

        if ($result !== null) {
            return true;
        }
        return false;
    }

}
