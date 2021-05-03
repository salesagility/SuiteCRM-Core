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
import {ViewMode} from 'common';
import {SavedFilterActionData, SavedFilterActionHandler, SavedFilterActionHandlerMap} from './saved-filter.action';
import {SavedFilterSaveAction} from './save/saved-filter-save.action';
import {SavedFilterDeleteAction} from './delete/saved-filter-delete.action';

@Injectable({
    providedIn: 'root',
})
export class SavedFilterActionManager {

    actions: { [key: string]: SavedFilterActionHandlerMap } = {
        edit: {} as SavedFilterActionHandlerMap,
        detail: {} as SavedFilterActionHandlerMap,
    };

    constructor(
        save: SavedFilterSaveAction,
        deleteAction: SavedFilterDeleteAction
    ) {
        save.modes.forEach(mode => this.actions[mode][save.key] = save);
        deleteAction.modes.forEach(mode => this.actions[mode][deleteAction.key] = deleteAction);
    }

    run(actionKey: string, mode: ViewMode, data: SavedFilterActionData): void {
        if (!this.actions || !this.actions[mode] || !this.actions[mode][actionKey]) {
            return;
        }

        this.actions[mode][actionKey].run(data);
    }

    getHandler(action: string, mode: ViewMode): SavedFilterActionHandler {
        if (!this.actions || !this.actions[mode] || !this.actions[mode][action]) {
            return null;
        }

        return this.actions[mode][action];
    }
}
