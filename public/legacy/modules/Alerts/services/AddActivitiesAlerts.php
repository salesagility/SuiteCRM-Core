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

require_once __DIR__ . '/AddAlert.php';

class AddActivitiesAlerts
{

    /**
     * @var AddAlert
     */
    protected $addAlertService;

    public function __construct()
    {
        $this->addAlertService = new AddAlert();
    }

    public function run()
    {
        global $current_user;

        if (empty($current_user->id)) {
            return;
        }

        [$alertDateTimeNow, $dateTimeMax, $dateTimeNow] = $this->getDateRange();

        $this->addMeetingsAlerts($dateTimeNow, $dateTimeMax, $alertDateTimeNow);

        $this->addCallAlerts($dateTimeNow, $dateTimeMax, $alertDateTimeNow);

    }

    /**
     * @param string $dateTimeNow
     * @param string $dateTimeMax
     * @param string $alertDateTimeNow
     * @return void
     */
    protected function addCallAlerts(string $dateTimeNow, string $dateTimeMax, string $alertDateTimeNow): void
    {
        global $db, $app_strings, $timedate, $current_user;

        $desc = $this->getDescriptionField();

        // Prep Calls Query
        $selectCalls = "
				SELECT calls.id, name, reminder_time, $desc, date_start, status, parent_type, parent_id
				FROM calls LEFT JOIN calls_users ON calls.id = calls_users.call_id
				WHERE calls_users.user_id ='" . $current_user->id . "'
				    AND calls_users.accept_status != 'decline'
				    AND calls.reminder_time != -1
					AND calls_users.deleted != 1
					AND calls.status = 'Planned'
				    AND date_start >= $dateTimeNow
				    AND date_start <= $dateTimeMax";

        $result = $db->query($selectCalls);

        while ($row = $db->fetchByAssoc($result)) {
            // need to concatenate since GMT times can bridge two local days
            $timeStart = strtotime($db->fromConvert($row['date_start'], 'datetime'));
            $timeRemind = $row['reminder_time'];
            $timeStart -= $timeRemind;
            $row['description'] = (isset($row['description'])) ? $row['description'] : '';

            $relatedToCall = $this->getRelatedName($row['parent_type'], $row['parent_id']);

            $callDescription = $row['description'] . "\n" . $app_strings['MSG_JS_ALERT_MTG_REMINDER_STATUS'] . $row['status'] . "\n" . $app_strings['MSG_JS_ALERT_MTG_REMINDER_RELATED_TO'] . $relatedToCall;

            $meetingName = $row['name'];
            $dateStart = $timedate->to_display_date_time($db->fromConvert($row['date_start'], 'datetime'));
            $alertSubtitle = $app_strings['MSG_JS_ALERT_MTG_REMINDER_TIME'] . $dateStart;
            $alertDescription = $app_strings['MSG_JS_ALERT_MTG_REMINDER_DESC'] . $callDescription;
            $alertURL = 'index.php?action=DetailView&module=Calls&record=' . $row['id'];

            $this->addAlertService->run(
                'Call',
                $meetingName,
                $alertDescription,
                $alertURL,
                $row['date_start']
            );
        }
    }

    /**
     * @param string $dateTimeNow
     * @param string $dateTimeMax
     * @param string $alertDateTimeNow
     * @return void
     */
    protected function addMeetingsAlerts(string $dateTimeNow, string $dateTimeMax, string $alertDateTimeNow): void
    {

        global $db, $app_strings, $timedate, $current_user, $sugar_config;

        $desc = $this->getDescriptionField();

        // Prep Meetings Query
        $selectMeetings = "SELECT meetings.id, name,reminder_time, $desc,location, status, parent_type, parent_id, date_start, assigned_user_id
			FROM meetings LEFT JOIN meetings_users ON meetings.id = meetings_users.meeting_id
			WHERE meetings_users.user_id ='" . $current_user->id . "'
				AND meetings_users.accept_status != 'decline'
				AND meetings.reminder_time != -1
				AND meetings_users.deleted != 1
				AND meetings.status = 'Planned'
			    AND date_start >= $dateTimeNow
			    AND date_start <= $dateTimeMax";
        $result = $db->query($selectMeetings);

        [$meetingIntegration, $sugar_config] = $this->initMeetingIntegration($sugar_config);

        while ($row = $db->fetchByAssoc($result)) {
            // need to concatenate since GMT times can bridge two local days
            $timeStart = strtotime($db->fromConvert($row['date_start'], 'datetime'));
            $timeRemind = $row['reminder_time'];
            $timeStart -= $timeRemind;

            $url = 'index.php?action=DetailView&module=Meetings&record=' . $row['id'];
            $instructions = $app_strings['MSG_JS_ALERT_MTG_REMINDER_MEETING_MSG'];

            if (!empty($meetingIntegration) && $meetingIntegration->isIntegratedMeeting($row['id'])) {
                $url = $meetingIntegration->miUrlGetJsAlert($row);
                $instructions = $meetingIntegration->miGetJsAlertInstructions();
            }

            $meetingName = from_html($row['name']);
            $desc1 = from_html($row['description']);
            $location = from_html($row['location']);

            $relatedToMeeting = $this->getRelatedName($row['parent_type'], $row['parent_id']);

            $description = empty($desc1) ? '' : $app_strings['MSG_JS_ALERT_MTG_REMINDER_AGENDA'] . $desc1 . "\n";
            $description .= "\n" . $app_strings['MSG_JS_ALERT_MTG_REMINDER_STATUS'] . $row['status'] . "\n" . $app_strings['MSG_JS_ALERT_MTG_REMINDER_RELATED_TO'] . $relatedToMeeting;

            $dateStart = $timedate->to_display_date_time($db->fromConvert($row['date_start'], 'datetime'));
            $alertSubtitle = $app_strings['MSG_JS_ALERT_MTG_REMINDER_TIME'] . $dateStart;
            $alertDescription = $app_strings['MSG_JS_ALERT_MTG_REMINDER_LOC'] . $location . $description . $instructions;

            $this->addAlertService->run(
                'Meeting',
                $meetingName,
                $alertDescription,
                $url,
                $row['date_start']
            );
        }
    }

    /**
     * @return mixed|string
     */
    protected function getDescriptionField()
    {
        global $db;

        $desc = $db->convert("description", "text2char");
        if ($desc !== "description") {
            $desc .= " description";
        }

        return $desc;
    }

    /**
     * @return array
     */
    protected function getDateRange(): array
    {
        global $timedate, $app_list_strings, $db;
        //Create separate variable to hold timedate value
        $alertDateTimeNow = $timedate->nowDb();

        $reminder_max_time = $app_list_strings['reminder_max_time'] ?? 0;

        // cn: get a boundary limiter
        $dateTimeMax = $timedate->getNow()->modify("+{$reminder_max_time} seconds")->asDb();
        $dateTimeNow = $timedate->getNow()->modify("-60 seconds")->asDb();

        $db = DBManagerFactory::getInstance();
        $dateTimeNow = $db->convert($db->quoted($dateTimeNow), 'datetime');
        $dateTimeMax = $db->convert($db->quoted($dateTimeMax), 'datetime');

        return [$alertDateTimeNow, $dateTimeMax, $dateTimeNow];
    }

    /**
     * @param array $sugar_config
     * @return array
     */
    protected function initMeetingIntegration(array $sugar_config): array
    {
        $meetingIntegration = null;
        if (isset($sugar_config['meeting_integration']) && !empty($sugar_config['meeting_integration'])) {
            if (!class_exists($sugar_config['meeting_integration'])) {
                require_once("modules/{$sugar_config['meeting_integration']}/{$sugar_config['meeting_integration']}.php");
            }
            $meetingIntegration = new $sugar_config['meeting_integration']();
        }

        return [$meetingIntegration, $sugar_config];
    }

    /**
     * To return the name of parent bean.
     * @param $parentType
     * @param $parentId
     * @return string
     */
    protected function getRelatedName($parentType, $parentId): string
    {
        if (!empty($parentType) && !empty($parentId)) {
            $parentBean = BeanFactory::getBean($parentType, $parentId);
            if (($parentBean instanceof SugarBean) && isset($parentBean->name)) {
                return $parentBean->name;
            }
        }

        return '';
    }

}
