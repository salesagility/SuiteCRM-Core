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

/* @noinspection PhpIncludeInspection */
require_once 'include/portability/ApiBeanMapper/ApiBeanMapper.php';

/**
 * Class TrackerManagerPort
 * Ported from SugarView::_trackView
 */
class TrackerManagerPort
{
    /**
     * @var ApiBeanMapper
     */
    protected $apiBeanMapper;

    public function __construct()
    {
        $this->apiBeanMapper = new ApiBeanMapper();
    }

    /**
     * @param array $modules
     * @return array
     */
    public function getModule(array $modules): array
    {
        global $current_user;
        $db = DBManagerFactory::getInstance();
        $userId = $db->quote($current_user->id);
        $tracker = BeanFactory::newBean('Trackers');

        if (!empty($modules)) {
            $history_max_viewed = 10;
        } else {
            $history_max_viewed = (!empty($GLOBALS['sugar_config']['history_max_viewed'])) ? $GLOBALS['sugar_config']['history_max_viewed'] : 50;
        }

        $table = $tracker->table_name;

        if (!empty($modules)) {
            $quotedModules = [];
            foreach ($modules as $module) {
                $quotedModules[] = $db->quote($module);
            }
            $moduleList = "'" . implode("','", $quotedModules) . "'";
        }

        $query = "SELECT *
                  FROM $table
                  WHERE id IN (
                    SELECT MAX(id) as id
                    FROM $table
                    WHERE user_id = '$userId'
                      AND deleted = 0
                      AND visible = 1
                      AND module_name IN ($moduleList)
                    GROUP BY item_id
                  )
                  ORDER BY date_modified DESC";

        $result = $tracker->db->limitQuery($query, 0, $history_max_viewed, true, $query);

        $list = [];
        while (($row = $tracker->db->fetchByAssoc($result))) {
            $bean = BeanFactory::newBean('Trackers');
            $bean->fromArray($row);
            $mapped = $this->apiBeanMapper->toApi($bean);
            $list[] = [
                'id' => $row['id'] ?? '',
                'module' => 'Trackers',
                'type' => 'Tracker',
                'attributes' => $mapped
            ];
        }

        return $list;
    }


    /**
     * @param string $id
     * @param string $module
     * @param string $action
     * @return array|null
     * @throws Exception
     */
    public function trackView(string $id, string $module, string $action): ?array
    {
        global $current_user;

        $action = strtolower($action);
        //Skip save, tracked in SugarBean instead
        if ($action === 'save') {
            return null;
        }

        if (empty($id)) {
            return null;
        }

        $bean = BeanFactory::getBean($module, $id);

        $trackerManager = TrackerManager::getInstance();
        $timeStamp = TimeDate::getInstance()->nowDb();

        /** @var Monitor $monitor */
        $monitor = $trackerManager->getMonitor('tracker');

        if ($monitor === null || $monitor === false) {
            return null;
        }

        $monitor->setValue('action', $action);
        $monitor->setValue('user_id', $current_user->id);
        $monitor->setValue('module_name', $module);
        $monitor->setValue('date_modified', $timeStamp);
        $monitor->setValue(
            'visible',
            (($monitor->action === 'detailview') || ($monitor->action === 'editview')) ? 1 : 0
        );

        $summaryText = '';
        if (!empty($bean->id)) {
            $monitor->setValue('item_id', $bean->id);
            $summaryText = $bean->get_summary_text();
            $monitor->setValue('item_summary', $summaryText);
        }

        //If visible is true, but there is no bean, do not track (invalid/unauthorized reference)
        //Also, do not track save actions where there is no bean id
        if ($monitor->visible && empty($bean->id)) {
            $trackerManager->unsetMonitor($monitor);

            return null;
        }

        $trackerManager->saveMonitor($monitor, true, true);

        return [
            'action' => $action,
            'user_id' => $current_user->id,
            'module_name' => $module,
            'date_modified' => $timeStamp,
            'item_id' => $id,
            'item_summary' => html_entity_decode($summaryText, ENT_QUOTES)
        ];
    }
}
