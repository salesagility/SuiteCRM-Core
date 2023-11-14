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

import { isEmpty } from 'lodash-es';
import { combineLatest, Observable, of } from 'rxjs';
import {
    distinctUntilChanged,
    filter,
    map,
    mergeMap,
    startWith,
    take,
} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
    Action,
    ActionContext,
    ActionHandler,
    EDITABLE_VIEW_MODES,
    LogicDefinitions,
    ModeActions,
    ObjectMap,
    Panel,
    PanelCell,
    PanelRow,
    Record,
    ViewMode,
} from 'common';
import { MetadataStore } from '../../../store/metadata/metadata.store.service';
import { RecordViewStore } from '../store/record-view/record-view.store';
import { RecordActionManager } from '../actions/record-action-manager.service';
import {
    AsyncActionInput,
    AsyncActionService,
} from '../../../services/process/processes/async-action/async-action';
import { RecordActionData } from '../actions/record.action';
import { LanguageStore } from '../../../store/language/language.store';
import { MessageService } from '../../../services/message/message.service';
import { Process } from '../../../services/process/process.service';
import { ConfirmationModalService } from '../../../services/modals/confirmation-modal.service';
import { BaseRecordActionsAdapter } from '../../../services/actions/base-record-action.adapter';
import { SelectModalService } from '../../../services/modals/select-modal.service';

@Injectable()
export class RecordActionsAdapter extends BaseRecordActionsAdapter<RecordActionData> {

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
                key: 'toggle-widgets',
                labelKey: 'LBL_INSIGHTS',
                params: {
                    expanded: true
                },
                acl: []
            }
        ],
    };

    constructor(
        protected store: RecordViewStore,
        protected metadata: MetadataStore,
        protected language: LanguageStore,
        protected actionManager: RecordActionManager,
        protected asyncActionService: AsyncActionService,
        protected message: MessageService,
        protected confirmation: ConfirmationModalService,
        protected selectModalService: SelectModalService
    ) {
        super(
            actionManager,
            asyncActionService,
            message,
            confirmation,
            language,
            selectModalService,
            metadata
        );
    }

    getActions(context?: ActionContext): Observable<Action[]> {
        return combineLatest(
            [
                this.metadata.recordViewMetadata$,
                this.store.mode$,
                this.store.record$,
                this.store.language$,
                this.store.widgets$,
                this.store.panels$,
            ]
        ).pipe(
            mergeMap((
                [
                    meta,
                    mode
                ]
            ) => {
                if (!mode || !meta) {
                    return of([]);
                }

                const actions = this.parseModeActions(meta.actions, mode, this.store.getViewContext());
                const stagingState = this.store.recordStore.getStaging();

                if (EDITABLE_VIEW_MODES.includes(mode)) {
                    const panelDisplayState$ = this.getLatestPanelDisplayStates();
                    return panelDisplayState$.pipe(
                        map(() => {
                            const requiredForSubmitObj: ObjectMap = this.extractRequiredSubmitFields();
                            this.disableActionsOnEditMode(actions, stagingState, requiredForSubmitObj);
                            return actions;
                        })
                    );
                } else {
                    const requiredForSubmitObj: ObjectMap = this.extractRequiredSubmitFields();
                    this.disableActionsOnDetailMode(actions, stagingState, requiredForSubmitObj);

                    return of(actions);
                }
            }),
        );
    }

    getLatestPanelDisplayStates(): Observable<any[]> {
        const panelDisplay$: Observable<any>[] = [];
        if (this.store) {
            this.store.panels.forEach((panel: Panel )=> {
                panelDisplay$.push(panel.display$);
            });
        }

        return combineLatest(panelDisplay$);
    }

    public disableActionsOnEditMode(actions: Action[], stagingState: Record, requiredForSubmitObj: ObjectMap): void {
        const submitReqFieldsChanges$ = [];
        stagingState.formGroup.markAllAsTouched();
        const validationState$ = stagingState.formGroup.statusChanges.pipe(
            startWith(stagingState.formGroup.status),
            filter(status => status !== 'PENDING' && status !== 'DISABLED'),
            map(status => status !== 'VALID')
        );

        Object.keys(requiredForSubmitObj).forEach(fieldName => {
            const field = stagingState?.fields[fieldName];
            if(field) {
                const valueChanges$: Observable<boolean> = field.valueChanges$.pipe(
                    distinctUntilChanged(),
                    map((valueChange: any) => !isEmpty(valueChange.value) ||
                          !isEmpty(valueChange.valueList) ||
                          !isEmpty(valueChange.valueObject))
                );
                submitReqFieldsChanges$.push(valueChanges$);
            }
        });
        actions.forEach(action => {
            const disableOnValidationErrors = action.disableOnValidationErrors ?? false;
            const disableOnReqFieldsNotChecked = action.disableOnReqFieldsNotChecked ?? false;

            const hasAllReqFieldsValue$: Observable<boolean> = combineLatest(submitReqFieldsChanges$).pipe(
                distinctUntilChanged(),
                map((reqArr: any) => reqArr.every(value => value))
            );

            if (disableOnValidationErrors && disableOnReqFieldsNotChecked) {
                action.disabled$  = combineLatest([validationState$, hasAllReqFieldsValue$]).pipe(
                    map(([isValid, hasAllValue]) => isValid || !hasAllValue)
                );
            }

            else if (disableOnValidationErrors && !disableOnReqFieldsNotChecked) {
                action.disabled$ = validationState$;
            }

            else if (!disableOnValidationErrors && disableOnReqFieldsNotChecked) {
                action.disabled$ = hasAllReqFieldsValue$;
            } else {
                return;
            }

        });
    }

    protected buildActionData(action: Action, context?: ActionContext): RecordActionData {
        return {
            store: this.store,
            action,
        } as RecordActionData;
    }

    /**
     * Build backend process input
     *
     * @param {Action} action Action
     * @param {string} actionName Action Name
     * @param {string} moduleName Module Name
     * @param {ActionContext|null} context Context
     * @returns {AsyncActionInput} Built backend process input
     */
    protected buildActionInput(action: Action, actionName: string, moduleName: string, context: ActionContext = null): AsyncActionInput {
        const baseRecord = this.store.getBaseRecord();

        this.message.removeMessages();

        return {
            action: actionName,
            module: baseRecord.module,
            id: baseRecord.id,
            params: (action && action.params) || []
        } as AsyncActionInput;
    }

    protected getMode(): ViewMode {
        return this.store.getMode();
    }

    protected getModuleName(context?: ActionContext): string {
        return this.store.getModuleName();
    }

    protected reload(action: Action, process: Process, context?: ActionContext): void {
        this.store.load(false).pipe(take(1)).subscribe();
    }

    private disableActionsOnDetailMode(actions: Action[], stagingState: Record, requiredForSubmitObj: ObjectMap): void {
        Object.keys(requiredForSubmitObj).forEach((fieldName) => {
            const field = stagingState.fields[fieldName];
            if (!field) {
                return;
            }
            if (
                !isEmpty(field?.value)
              || !isEmpty(field?.valueList)
              || !isEmpty(field?.valueObject)
            ) {
                return;
            }
            actions.forEach((action) => {
                const disableOnReqFieldsNotChecked = action.disableOnReqFieldsNotChecked ??
                  false;
                if (disableOnReqFieldsNotChecked) {
                    action.disabled$ = of(true);
                }
            });
        });
    }

    private extractRequiredSubmitFields(): ObjectMap {
        const requiredForSubmitObj = {};
        this.store.panels.forEach((panel: Panel) => {
            panel.rows.forEach((panelRow: PanelRow) => {
                panelRow.cols.forEach((col: PanelCell) => {
                    if (col?.required_f_submit && panel.displayState.value) {
                        requiredForSubmitObj[col.name] = col?.required_f_submit;
                    }
                });
            });
        });
        return requiredForSubmitObj;
    }

}
