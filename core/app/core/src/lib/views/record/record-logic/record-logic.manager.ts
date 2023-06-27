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
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */

import {Injectable} from '@angular/core';
import {BaseActionManager} from '../../../services/actions/base-action-manager.service';
import {Action, deepClone, ModeActions, Record, ViewMode} from 'common';
import {RecordLogicActionData} from './record-logic.action';
import {ConfirmationModalService} from '../../../services/modals/confirmation-modal.service';
import {SelectModalService} from '../../../services/modals/select-modal.service';
import {take} from 'rxjs/operators';
import {Process} from '../../../services/process/process.service';
import {MessageService} from '../../../services/message/message.service';
import {AsyncActionInput, AsyncActionService} from '../../../services/process/processes/async-action/async-action';
import {MetadataStore} from '../../../store/metadata/metadata.store.service';
import {RecordLogicContext} from './record-logic.model';
import {ActiveLogicChecker} from '../../../services/logic/active-logic-checker.service';

@Injectable({
    providedIn: 'root'
})
export class RecordLogicManager extends BaseActionManager<RecordLogicActionData> {

    constructor(
        protected confirmation: ConfirmationModalService,
        protected selectModalService: SelectModalService,
        protected asyncActionService: AsyncActionService,
        protected message: MessageService,
        protected metadataStore: MetadataStore,
        protected activeLogicChecker: ActiveLogicChecker
    ) {
        super();
    }

    /**
     * Run logic for the given record
     * @param context
     */
    public runLogic(context: RecordLogicContext): void {
        if (!context && !context.logicEntries || !context.logicEntries.length) {
            return;
        }

        const logicActions = this.parseModeLogicActions(context.logicEntries, context.mode);

        logicActions.forEach(logicAction => {
            const isActive = this.activeLogicChecker.run(context.record, logicAction);
            if (!isActive) {
                return;
            }

            this.runAction(logicAction, context.mode, context);
        });
    }

    /**
     * Run the action using given context
     * @param action
     * @param mode
     * @param context
     */
    public runAction(action: Action, mode: ViewMode, context: RecordLogicContext = null): void {
        const params = (action && action.params) || {} as { [key: string]: any };
        const displayConfirmation = params.displayConfirmation || false;
        const confirmationLabel = params.confirmationLabel || '';

        const selectModal = action.params && action.params.selectModal;
        const selectModule = selectModal && selectModal.module;

        if (displayConfirmation) {
            this.confirmation.showModal(confirmationLabel, () => {
                if (!selectModule) {
                    this.callAction(action, context);
                    return;
                }
                this.showSelectModal(selectModal.module, action, mode, context);
            });

            return;
        }

        if (!selectModule) {
            this.callAction(action, context);
            return;
        }

        this.showSelectModal(selectModal.module, action, mode, context);
    }

    /**
     * Run async buk action
     *
     * @returns void
     * @param {string} selectModule: module for which records are listed in Select Modal/Popup
     * @param {string} asyncAction: bulk action name
     * @param {ViewMode} mode
     * @param {RecordLogicContext} context
     */
    public showSelectModal(selectModule: string, asyncAction: Action, mode: ViewMode, context: RecordLogicContext = null) {

        this.selectModalService.showSelectModal(selectModule, (modalRecord: Record) => {
            if (modalRecord) {
                const {fields, formGroup, ...baseRecord} = modalRecord;
                asyncAction.params.modalRecord = baseRecord;
            }
            this.callAction(asyncAction, context);
        });
    }

    public getBaseRecord(record: Record): Record {
        if (!record) {
            return null;
        }

        const baseRecord = {
            id: record.id ?? '',
            type: record.type ?? '',
            module: record.module ?? '',
            attributes: record.attributes ?? {},
            acls: record.acls ?? []
        } as Record;

        return deepClone(baseRecord);
    }

    /**
     * Call actions
     * @param action
     * @param context
     */
    protected callAction(action: Action, context: RecordLogicContext = null) {
        if (action.asyncProcess) {
            this.runAsyncAction(action, context);
            return;
        }
        this.runFrontEndAction(action, context);
    }

    /**
     * Run async actions
     * @param action
     * @param context
     */
    protected runAsyncAction(action: Action, context: RecordLogicContext = null): void {
        const actionName = this.getActionName(action);
        const moduleName = this.getModuleName(context);

        this.message.removeMessages();
        const asyncData = this.buildActionInput(action, context);

        const availableHandlers = [
            'set-fields'
        ];

        this.asyncActionService.run(actionName, asyncData, null, availableHandlers).pipe(take(1)).subscribe((process: Process) => {
            this.afterAsyncAction(actionName, moduleName, asyncData, process, action, context);
        });
    }

    /**
     * Build backend process input
     *
     * @param action
     * @param context
     */
    protected buildActionInput(action: Action, context: RecordLogicContext = null): AsyncActionInput {
        const actionName = this.getActionName(action);
        const baseRecord = this.getBaseRecord(context.record ?? {} as Record);

        this.message.removeMessages();

        return {
            action: actionName,
            module: baseRecord.module,
            id: baseRecord.id,
            params: (action && action.params) || [],
            record: baseRecord
        } as AsyncActionInput;
    }

    /**
     * Run after async action handlers
     * @param actionName
     * @param moduleName
     * @param asyncData
     * @param process
     * @param action
     * @param context
     * @protected
     */
    protected afterAsyncAction(
        actionName: string,
        moduleName: string,
        asyncData: AsyncActionInput,
        process: Process,
        action: Action,
        context: RecordLogicContext
    ) {
        if (this.shouldReload(process)) {
            this.reload(action, process, context);
        }

        const actionHandlerKey = process?.data?.handler ?? '';
        this.setFieldsAfterAction(actionHandlerKey, process, context);

        this.reloadMetadata(moduleName, action, process, context);
    }

    protected reload(action: Action, process: Process, context?: RecordLogicContext): void {
        if (!context.reload) {
            return;
        }
        context.reload().pipe(take(1)).subscribe();
    }

    /**
     * Should reload page
     * @param process
     */
    protected shouldReloadRecentlyViewed(process: Process): boolean {
        return !!(process.data && process.data.reloadRecentlyViewed);
    }

    /**
     * Should reload page
     * @param process
     */
    protected shouldReloadFavorites(process: Process): boolean {
        return !!(process.data && process.data.reloadFavorites);
    }

    /**
     * Should reload page
     * @param process
     */
    protected shouldReload(process: Process): boolean {
        return !!(process.data && process.data.reload);
    }

    /**
     * Reload the metadata for the module
     * @param moduleName
     * @param action
     * @param process
     * @param context
     * @protected
     */
    protected reloadMetadata(moduleName: string, action: Action, process: Process, context?: RecordLogicContext): void {
        const typesToLoad = [];

        if (this.shouldReloadRecentlyViewed(process)) {
            typesToLoad.push(this.metadataStore.typeKeys.recentlyViewed);
        }

        if (this.shouldReloadFavorites(process)) {
            typesToLoad.push(this.metadataStore.typeKeys.favorites);
        }

        if (typesToLoad && typesToLoad.length) {
            this.metadataStore.reloadModuleMetadata(moduleName, typesToLoad, false).pipe(take(1)).subscribe();
        }
    }

    /**
     * Get module name
     * @param {object} context
     */
    protected getModuleName(context?: RecordLogicContext): string {
        return context.record.module;
    }

    /**
     * Get action name
     * @param action
     */
    protected getActionName(action: Action) {
        return `${action.key}`;
    }

    /**
     * Run front end action
     * @param {object} action
     * @param {object} context
     */
    protected runFrontEndAction(action: Action, context: RecordLogicContext = null): void {
        const data: RecordLogicActionData = this.buildActionData(action, context);

        // TO DO ADD access to the store!

        this.run(action, context.mode, data);
    }

    protected buildActionData(action: Action, context?: RecordLogicContext): RecordLogicActionData {
        return {
            record: (context && context.record) || null,
        } as RecordLogicActionData;
    }

    /**
     * Parse mode actions
     * @param declaredActions
     * @param mode
     */
    protected parseModeLogicActions(declaredActions: Action[], mode: ViewMode) {
        if (!declaredActions) {
            return [];
        }

        const availableActions = {
            list: [],
            detail: [],
            edit: [],
            create: [],
            massupdate: [],
            filter: [],
        } as ModeActions;

        if (declaredActions && declaredActions.length) {
            declaredActions.forEach(action => {
                if (!action.modes || !action.modes.length) {
                    return;
                }

                action.modes.forEach(actionMode => {
                    if (!availableActions[actionMode] && !action.asyncProcess) {
                        return;
                    }
                    availableActions[actionMode].push(action);
                });
            });
        }

        const actions = [];

        availableActions[mode].forEach(action => {
            actions.push(action);
        });

        return actions;
    }

    private setFieldsAfterAction(actionHandlerKey, process: Process, context: RecordLogicContext) {
        if (actionHandlerKey !== 'set-fields') {
            return
        }

        const params = process?.data?.params ?? {};
        const fieldsValuesToSet = params['fieldValues'] ?? null;

        if (!fieldsValuesToSet) {
            return;
        }

        Object.keys(fieldsValuesToSet).forEach(fieldName => {
            const fieldValue = fieldsValuesToSet[fieldName] ?? null;
            if (fieldValue === null || !context?.record?.fields[fieldName]) {
                return;
            }

            context.record.fields[fieldName].value = fieldValue;
            context.record.fields[fieldName].formControl.setValue(fieldValue);
        });
    }

}
