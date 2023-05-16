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

class AddAlert
{

    /**
     * Add an alert
     * @param string $target_module
     * @param string $name
     * @param string $description
     * @param string|null $url_redirect
     * @param string $date_start
     * @param string $reminder_id
     * @param string $type
     * @param bool $is_read
     * @return void
     */
    public function run(
        string $target_module,
        string $name,
        string $description = '',
        string $url_redirect = null,
        string $date_start = '',
        string $reminder_id = '',
        string $type = 'info',
        bool $is_read = false
    ): void {
        global $current_user, $timedate;

        $assigned_user_id = $current_user->id;
        $snooze = $timedate->nowDb();

        if ($url_redirect === null) {
            $url_redirect = 'index.php?fakeid=' . uniqid('fake_', true);
        }

        $result = null;

        if (!empty($reminder_id)) {
            $alert = BeanFactory::getBean('Alerts');
            $result = $alert->get_full_list(
                "",
                "alerts.assigned_user_id = '" . $current_user->id . "' AND reminder_id = '" . $reminder_id . "'"
            );
        }


        if (!empty($result)) {
            return;
        }

        /** @var Alert $alert */
        $alert = BeanFactory::newBean('Alerts');
        $alert->name = html_entity_decode($name, ENT_QUOTES | ENT_SUBSTITUTE | ENT_HTML401);
        $alert->description = $description;
        $alert->url_redirect = $url_redirect;
        $alert->target_module = $target_module;
        $alert->is_read = $is_read;
        $alert->assigned_user_id = $assigned_user_id;
        $alert->type = $type;
        $alert->reminder_id = $reminder_id;
        $alert->snooze = $snooze;
        $alert->date_start = $date_start;
        $alert->save();
    }

}
