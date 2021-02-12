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
import {RecordViewStore} from '@views/record/store/record-view/record-view.store';
import {MetadataStore} from '@store/metadata/metadata.store.service';
import {LanguageStore} from '@store/language/language.store';
import {Action, ActionDataSource, ModeActions} from '@app-common/actions/action.model';
import {combineLatest, Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {RecordActionManager} from '@views/record/actions/record-action-manager.service';
import {RecordActionData} from '@views/record/actions/record.action';
import {AsyncActionInput, AsyncActionService} from '@services/process/processes/async-action/async-action';
import {Process} from '@services/process/process.service';
import {MessageService} from '@services/message/message.service';

@Injectable()
export class RecordActionsAdapter implements ActionDataSource {

    defaultActions: ModeActions = {
        detail: [
            {
                key: 'toggle-widgets',
                labelKey: 'LBL_INSIGHTS',
                params: {
                    expanded: true
                },
                acl: []
            },
        ],
        edit: [
            {
                key: 'cancel',
                labelKey: 'LBL_CANCEL',
                params: {
                    expanded: true
                },
                acl: []
            },
            {
                key: 'toggle-widgets',
                labelKey: 'LBL_INSIGHTS',
                params: {
                    expanded: true
                },
                acl: []
            },
        ],
        create: [
            {
                key: 'cancelCreate',
                labelKey: 'LBL_CANCEL',
                params: {
                    expanded: true
                },
                acl: []
            },
        ],
    };

    constructor(
        protected store: RecordViewStore,
        protected metadata: MetadataStore,
        protected language: LanguageStore,
        protected actionManager: RecordActionManager,
        protected asyncActionService: AsyncActionService,
        protected message: MessageService
    ) {
    }

    getActions(): Observable<Action[]> {
        return combineLatest(
            [
                this.metadata.recordViewMetadata$,
                this.store.mode$,
                this.store.record$,
                this.language.vm$,
                this.store.widgets$
            ]
        ).pipe(
            map((
                [
                    meta,
                    mode,
                    record,
                    languages,
                    widget
                ]
            ) => {
                if (!mode || !meta) {
                    return [];
                }

                const availableActions = {
                    detail: [],
                    edit: [],
                    create: [],
                } as ModeActions;

                if (meta.actions && meta.actions.length) {
                    meta.actions.forEach(action => {
                        if (!action.modes || !action.modes.length) {
                            return;
                        }

                        action.modes.forEach(actionMode => {
                            if (!availableActions[actionMode]) {
                                return;
                            }
                            availableActions[actionMode].push(action);
                        });
                    });
                }

                availableActions.detail = availableActions.detail.concat(this.defaultActions.detail);
                availableActions.edit = availableActions.edit.concat(this.defaultActions.edit);
                availableActions.create = availableActions.create.concat(this.defaultActions.create);

                const actions = [];

                availableActions[mode].forEach(action => {

                    if (!action.asyncProcess) {
                        const actionHandler = this.actionManager.getHandler(action.key, mode);

                        if (!actionHandler || !actionHandler.shouldDisplay(this.store)) {
                            return;
                        }
                        action.status = actionHandler.getStatus(this.store) || '';
                    }

                    const label = this.language.getFieldLabel(action.labelKey, record.module, languages);
                    actions.push({
                        ...action,
                        label
                    });
                });

                return actions;
            })
        );
    }

    runAction(action: Action): void {

        if (action.asyncProcess) {
            this.runAsyncAction(action);
            return;
        }
        this.runFrontEndAction(action);
    }

    protected runAsyncAction(action: Action): void {
        const actionName = `record-${action.key}`;
        const baseRecord = this.store.getBaseRecord();

        this.message.removeMessages();

        const asyncData = {
            action: actionName,
            module: baseRecord.module,
            id: baseRecord.id,
        } as AsyncActionInput;

        this.asyncActionService.run(actionName, asyncData).pipe(take(1)).subscribe((process: Process) => {
            if (process.data && process.data.reload) {
                this.store.load(false).pipe(take(1)).subscribe();
            }
        });
    }

    protected runFrontEndAction(action: Action): void {
        const data: RecordActionData = {
            store: this.store
        };

        this.actionManager.run(action.key, this.store.getMode(), data);
    }
}
