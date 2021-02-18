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
import {Observable} from 'rxjs';
import {catchError, take, tap} from 'rxjs/operators';
import {Process, ProcessService} from '@services/process/process.service';
import {AppStateStore} from '@store/app-state/app-state.store';
import {MessageService} from '@services/message/message.service';
import {AsyncActionHandler} from '@services/process/processes/async-action/async-action.model';
import {SearchCriteria} from 'common';
import {SortingSelection} from 'common';
import {RedirectAsyncAction} from '@services/process/processes/async-action/actions/redirect/redirect.async-action';
import {ExportAsyncAction} from '@services/process/processes/async-action/actions/export/export.async-action';

export interface AsyncActionInput {
    action: string;
    module: string;
    criteria?: SearchCriteria;
    sort?: SortingSelection;
    ids?: string[];
}

@Injectable({
    providedIn: 'root',
})
export class AsyncActionService {

    actions: { [key: string]: AsyncActionHandler } = {};

    constructor(
        private processService: ProcessService,
        private appStateStore: AppStateStore,
        protected message: MessageService,
        protected redirectAction: RedirectAsyncAction,
        protected exportAction: ExportAsyncAction
    ) {
        this.registerHandler(redirectAction);
        this.registerHandler(exportAction);
    }

    public registerHandler(handler: AsyncActionHandler): void {
        this.actions[handler.key] = handler;
    }

    /**
     * Send action request
     *
     * @param {string} action to submit
     * @param {string} data to send
     * @returns {object} Observable<Process>
     */
    public run(action: string, data: AsyncActionInput): Observable<Process> {
        const options = {
            ...data
        };

        this.appStateStore.updateLoading(action, true);

        return this.processService
            .submit(action, options)
            .pipe(
                take(1),
                tap((process: Process) => {
                    this.appStateStore.updateLoading(action, false);

                    let handler = 'addSuccessMessageByKey';
                    if (process.status === 'error') {
                        handler = 'addDangerMessageByKey';
                    }

                    if (process.messages) {
                        process.messages.forEach(message => {
                            this.message[handler](message);
                        });
                    }

                    if (process.status === 'error') {
                        return;
                    }

                    if (process.data && !process.data.handler) {
                        return;
                    }

                    const actionHandler: AsyncActionHandler = this.actions[process.data.handler];

                    if (!actionHandler) {
                        this.message.addDangerMessageByKey('LBL_MISSING_HANDLER');
                        return;
                    }

                    actionHandler.run(process.data.params);

                }),
                catchError(err => {
                    this.message.addDangerMessageByKey('LBL_ACTION_ERROR');
                    this.appStateStore.updateLoading(action, false);
                    throw err;
                }),
            );
    }
}
