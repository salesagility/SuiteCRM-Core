<?php

namespace App\Data\LegacyHandler;

use ACLController;
use SecurityGroup;
use SugarBean;

trait SecurityFiltersTrait
{


    /**
     * @param SugarBean $bean
     * @param string $where
     * @param string|null $table
     * @return string
     */
    public function addSecurityWhereClause(SugarBean $bean, string $where, string $table = null): string
    {
        global $current_user, $sugar_config;

        $filterUserList = $sugar_config['securitysuite_filter_user_list'] ?? false;

        $tableName = $table ?? $bean->table_name;

        if ($filterUserList && $bean->module_dir === 'Users' && !is_admin($current_user)) {
            /* @noinspection PhpIncludeInspection */
            require_once 'modules/SecurityGroups/SecurityGroup.php';

            $group_where = SecurityGroup::getGroupUsersWhere($current_user->id);
            if (empty($where)) {
                $where = " (" . $group_where . ") ";
            } else {
                $where .= " AND (" . $group_where . ") ";
            }

            return $where;
        }

        if ($bean->bean_implements('ACL') && ACLController::requireSecurityGroup($bean->module_dir, 'list')) {
            /* @noinspection PhpIncludeInspection */
            require_once 'modules/SecurityGroups/SecurityGroup.php';

            $owner_where = $this->getOwnerWhere($tableName, $current_user->id);
            $group_where = SecurityGroup::getGroupWhere($tableName, $bean->module_dir, $current_user->id);

            if (!empty($owner_where)) {
                $condition = " (" . $owner_where . " or " . $group_where . ") ";
            } else {
                $condition = $group_where;
            }

            if (empty($where)) {
                $where = $condition;
            } else {
                $where .= ' AND ' . $condition;
            }
        }

        return $where;
    }

    /**
     * Gets there where statement for checking if a user is an owner
     *
     * @param string $table
     * @param string $user_id GUID
     * @return string
     */
    public function getOwnerWhere(string $table, string $user_id): string
    {
        if (isset($this->field_defs['assigned_user_id'])) {
            return " $table.assigned_user_id ='$user_id' ";
        }
        if (isset($this->field_defs['created_by'])) {
            return " $table.created_by ='$user_id' ";
        }

        return '';
    }
}
