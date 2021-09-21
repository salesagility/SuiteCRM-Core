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
import {Process, ProcessService} from '../../process.service';
import {AppStateStore} from '../../../../store/app-state/app-state.store';
import {MessageService} from '../../../message/message.service';
import {AsyncActionHandler} from './async-action.model';
import {Record, SearchCriteria, SortingSelection} from 'common';
import {RedirectAsyncAction} from './actions/redirect/redirect.async-action';
import {ExportAsyncAction} from './actions/export/export.async-action';
import {NoopAsyncAction} from './actions/noop/noop.async-action';
import {ChangelogAsyncAction} from './actions/changelog/changelog.async-action';

export interface AsyncActionInput {
    action: string;
    module: string;
    criteria?: SearchCriteria;
    sort?: SortingSelection;
    ids?: string[];
    id?: string;
    payload?: { [key: string]: any };
    modalRecord?: Record;
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
        protected exportAction: ExportAsyncAction,
        protected noopAction: NoopAsyncAction,
        protected changelogAction: ChangelogAsyncAction
    ) {
        this.registerHandler(redirectAction);
        this.registerHandler(exportAction);
        this.registerHandler(noopAction);
        this.registerHandler(changelogAction);
    }

    public registerHandler(handler: AsyncActionHandler): void {
        this.actions[handler.key] = handler;
    }

    /**
     * Send action request
     *
     * @param {string} actionName to submit
     * @param {string} data to send
     * @param {string} presetHandlerKey to use
     * @returns {object} Observable<Process>
     */
    public run(actionName: string, data: AsyncActionInput, presetHandlerKey: string = null): Observable<Process> {
        const options = {
            ...data
        };

        this.appStateStore.updateLoading(actionName, true);

        return this.processService
            .submit(actionName, options)
            .pipe(
                take(1),
                tap((process: Process) => {
                    this.appStateStore.updateLoading(actionName, false);

                    let handler = 'addSuccessMessageByKey';
                    if (process.status === 'error') {
                        handler = 'addDangerMessageByKey';
                    }

                    if (process.messages) {
                        process.messages.forEach(message => {
                            if(!!message) {
                                this.message[handler](message);
                            }
                        });
                    }

                    if (process.status === 'error') {
                        return;
                    }

                    const actionHandlerKey = presetHandlerKey || (process.data && process.data.handler) || null;

                    if (!actionHandlerKey) {
                        return;
                    }

                    const actionHandler: AsyncActionHandler = this.actions[actionHandlerKey];

                    if (!actionHandler) {
                        this.message.addDangerMessageByKey('LBL_MISSING_HANDLER');
                        return;
                    }

                    actionHandler.run(process.data.params);

                }),
                catchError(err => {
                    this.message.addDangerMessageByKey('LBL_ACTION_ERROR');
                    this.appStateStore.updateLoading(actionName, false);
                    throw err;
                }),
            );
    }
}
