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
import {Action, ActionDataSource} from 'common';
import {Observable, of} from 'rxjs';
import {take} from 'rxjs/operators';
import {AsyncActionInput, AsyncActionService} from '../../../services/process/processes/async-action/async-action';
import {MessageService} from '../../../services/message/message.service';
import {Process} from '../../../services/process/process.service';

@Injectable({
    providedIn: 'root',
})
export class SubpanelActionsAdapter implements ActionDataSource {

    constructor(
        protected asyncActionService: AsyncActionService,
        protected message: MessageService
    ) {
    }

    getActions(): Observable<Action[]> {
        // not yet implemented
        return of([]);
    }

    runAction(action: Action): void {
        if (action.asyncProcess) {
            this.runAsyncAction(action);
            return;
        }
    }

    protected runAsyncAction(action: Action): void {
        const actionName = `record-${action.key}`;
        this.message.removeMessages();

        const asyncData = {
            action: actionName,
            module: action.params.payload.relateModule,
            payload: {...action.params.payload}
        } as AsyncActionInput;

        this.asyncActionService.run(actionName, asyncData).pipe(take(1)).subscribe((process: Process) => {
            if (process.status === 'success' && process.data && process.data.reload) {
                action.params.store.load(false).pipe(take(1)).subscribe();
                action.params.store.loadAllStatistics(false).pipe(take(1)).subscribe();
            }
        });
    }

}
