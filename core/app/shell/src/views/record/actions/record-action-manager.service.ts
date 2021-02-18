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

import {Injectable} from '@angular/core';
import {RecordEditAction} from '@views/record/actions/edit/record-edit.action';
import {ViewMode} from 'common';
import {RecordActionData, RecordActionHandler, RecordActionHandlerMap} from '@views/record/actions/record.action';
import {RecordCreateAction} from '@views/record/actions/create/record-create.action';
import {RecordToggleWidgetsAction} from '@views/record/actions/toggle-widgets/record-widget-action.service';
import {RecordCancelAction} from '@views/record/actions/cancel/record-cancel.action';
import {RecordSaveAction} from '@views/record/actions/save/record-save.action';
import {RecordSaveNewAction} from '@views/record/actions/save-new/record-save-new.action';
import {CancelCreateAction} from '@views/record/actions/cancel-create/cancel-create.action';

@Injectable({
    providedIn: 'root',
})
export class RecordActionManager {

    actions: { [key: string]: RecordActionHandlerMap } = {
        edit: {} as RecordActionHandlerMap,
        detail: {} as RecordActionHandlerMap,
        create: {} as RecordActionHandlerMap
    };

    constructor(
        protected edit: RecordEditAction,
        protected create: RecordCreateAction,
        protected toggleWidgets: RecordToggleWidgetsAction,
        protected cancel: RecordCancelAction,
        protected cancelCreate: CancelCreateAction,
        protected save: RecordSaveAction,
        protected saveNew: RecordSaveNewAction,
    ) {
        edit.modes.forEach(mode => this.actions[mode][edit.key] = edit);
        create.modes.forEach(mode => this.actions[mode][create.key] = create);
        toggleWidgets.modes.forEach(mode => this.actions[mode][toggleWidgets.key] = toggleWidgets);
        cancel.modes.forEach(mode => this.actions[mode][cancel.key] = cancel);
        save.modes.forEach(mode => this.actions[mode][save.key] = save);
        saveNew.modes.forEach(mode => this.actions[mode][saveNew.key] = saveNew);
        cancelCreate.modes.forEach(mode => this.actions[mode][cancelCreate.key] = cancelCreate);
    }

    run(action: string, mode: ViewMode, data: RecordActionData): void {
        if (!this.actions || !this.actions[mode] || !this.actions[mode][action]) {
            return;
        }

        this.actions[mode][action].run(data);
    }

    getHandler(action: string, mode: ViewMode): RecordActionHandler {
        if (!this.actions || !this.actions[mode] || !this.actions[mode][action]) {
            return null;
        }

        return this.actions[mode][action];
    }
}
