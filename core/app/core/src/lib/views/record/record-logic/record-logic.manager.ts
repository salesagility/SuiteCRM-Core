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

import { take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Action, deepClone, MapEntry, ModeActions, Record, RecordMapper, RecordMapperRegistry, ViewMode } from 'common';
import { BaseActionManager } from '../../../services/actions/base-action-manager.service';
import { RecordLogicActionData } from './record-logic.action';
import { ConfirmationModalService } from '../../../services/modals/confirmation-modal.service';
import { SelectModalService } from '../../../services/modals/select-modal.service';
import { Process } from '../../../services/process/process.service';
import { MessageService } from '../../../services/message/message.service';
import { AsyncActionInput, AsyncActionService } from '../../../services/process/processes/async-action/async-action';
import { MetadataStore } from '../../../store/metadata/metadata.store.service';
import { RecordLogicContext } from './record-logic.model';
import { ActiveLogicChecker } from '../../../services/logic/active-logic-checker.service';
import { BaseSaveRecordMapper } from '../../../store/record/record-mappers/base-save.record-mapper';

@Injectable({
    providedIn: 'root',
})
export class RecordLogicManager extends BaseActionManager<RecordLogicActionData> {

    constructor(
        protected confirmation: ConfirmationModalService,
        protected selectModalService: SelectModalService,
        protected asyncActionService: AsyncActionService,
        protected message: MessageService,
        protected metadataStore: MetadataStore,
        protected activeLogicChecker: ActiveLogicChecker,
        protected baseMapper: BaseSaveRecordMapper,
        protected recordMappers: RecordMapperRegistry
    ) {
        super();
        recordMappers.register('default', baseMapper.getKey(), baseMapper);
    }

    /**
     * Run logic for the given record
     *
     * @param {object} context Context
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
     *
     * @param {Action} action Action
     * @param {ViewMode} mode Mode
     * @param {RecordLogicContext | null} context Context
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
     * @param {string} selectModule module for which records are listed in Select Modal/Popup
     * @param {Action} asyncAction bulk action name
     * @param {ViewMode} mode Mode
     * @param {RecordLogicContext} context Context
     */
    public showSelectModal(
        selectModule: string,
        asyncAction: Action,
        mode: ViewMode,
        context: RecordLogicContext = null,
    ): void {
        this.selectModalService.showSelectModal(selectModule, (modalRecord: Record) => {
            if (modalRecord) {
                const { ...baseRecord } = modalRecord;
                asyncAction.params.modalRecord = baseRecord;
            }
            this.callAction(asyncAction, context);
        });
    }

    /**
     * Get Base Record
     *
     * @param {Record} record record
     * @returns {Record} Base Record
     */
    public getBaseRecord(record: Record): Record {
        if (!record) {
            return null;
        }

        this.mapRecordFields(record);

        const baseRecord = {
            id: record.id ?? '',
            type: record.type ?? '',
            module: record.module ?? '',
            attributes: record.attributes ?? {},
            acls: record.acls ?? [],
        } as Record;

        return deepClone(baseRecord);
    }

    /**
     * Map staging fields
     *
     * @param {Record} record Record
     */
    protected mapRecordFields(record: Record): void {
        const mappers: MapEntry<RecordMapper> = this.recordMappers.get(record.module);

        Object.keys(mappers).forEach(key => {
            const mapper = mappers[key];
            mapper.map(record);
        });
    }

    /**
     * Call actions
     *
     * @param {Action} action Action
     * @param {RecordLogicContext | null} context Context
     */
    protected callAction(action: Action, context: RecordLogicContext = null): void {
        if (action.asyncProcess) {
            this.runAsyncAction(action, context);
            return;
        }
        this.runFrontEndAction(action, context);
    }

    /**
     * Run async actions
     *
     * @param {Action} action Action
     * @param {RecordLogicContext | null} context Context
     */
    protected runAsyncAction(action: Action, context: RecordLogicContext = null): void {
        const actionName = this.getActionName(action);
        const moduleName = this.getModuleName(context);

        this.message.removeMessages();
        const asyncData = this.buildActionInput(action, context);

        this.asyncActionService.run(actionName, asyncData, null, context)
            .pipe(take(1))
            .subscribe((process: Process) =>
                this.afterAsyncAction(moduleName, process, context)
            );
    }

    /**
     * Build backend process input
     *
     * @param {Action} action Action
     * @param {RecordLogicContext | null} context Context
     * @returns {AsyncActionInput} Action Input
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
            record: baseRecord,
        } as AsyncActionInput;
    }

    /**
     * Run after async action handlers
     *
     * @param {string} moduleName Module Name
     * @param {Process} process Process
     * @param {RecordLogicContext} context Context
     * @protected
     */
    protected afterAsyncAction(
        moduleName: string,
        process: Process,
        context: RecordLogicContext,
    ): void {
        if (this.shouldReload(process)) {
            this.reload(context);
        }

        this.reloadMetadata(moduleName, process);
    }

    /**
     * Reload
     *
     * @param {RecordLogicContext} context Context
     * @protected
     */
    protected reload(context?: RecordLogicContext): void {
        if (!context.reload) {
            return;
        }
        context.reload().pipe(take(1)).subscribe();
    }

    /**
     * Should reload page
     *
     * @param {Process} process Process
     * @returns {boolean} Should Reload?
     */
    protected shouldReloadRecentlyViewed(process: Process): boolean {
        return !!(process.data && process.data.reloadRecentlyViewed);
    }

    /**
     * Should reload page
     *
     * @param {Process} process Process
     * @returns {boolean} Should Reload?
     */
    protected shouldReloadFavorites(process: Process): boolean {
        return !!(process.data && process.data.reloadFavorites);
    }

    /**
     * Should reload page
     *
     * @param {Process} process Process
     * @returns {boolean} Should Reload?
     */
    protected shouldReload(process: Process): boolean {
        return !!(process.data && process.data.reload);
    }

    /**
     * Reload the metadata for the module
     *
     * @param {string} moduleName Module Name
     * @param {Process} process Process
     * @protected
     */
    protected reloadMetadata(moduleName: string, process: Process): void {
        const typesToLoad = [];

        if (this.shouldReloadRecentlyViewed(process)) {
            typesToLoad.push(this.metadataStore.typeKeys.recentlyViewed);
        }

        if (this.shouldReloadFavorites(process)) {
            typesToLoad.push(this.metadataStore.typeKeys.favorites);
        }

        if (typesToLoad && typesToLoad.length) {
            this.metadataStore.reloadModuleMetadata(moduleName, typesToLoad, false)
                .pipe(take(1))
                .subscribe();
        }
    }

    /**
     * Get module name
     *
     * @param {object} context Context
     * @returns {string} Module Name
     */
    protected getModuleName(context?: RecordLogicContext): string {
        return context.record.module;
    }

    /**
     * Get action name
     *
     * @param {Action} action Action
     * @returns {string} Action Name
     */
    protected getActionName(action: Action): string {
        return `${action.key}`;
    }

    /**
     * Run front end action
     *
     * @param {Action} action Action
     * @param {RecordLogicContext} context Context
     */
    protected runFrontEndAction(action: Action, context: RecordLogicContext = null): void {
        const data: RecordLogicActionData = this.buildActionData(action, context);

        // TO DO ADD access to the store!

        this.run(action, context.mode, data);
    }

    /**
     * Build Action Data
     *
     * @param {Action} action Action
     * @param {RecordLogicContext} context Context
     * @returns {RecordLogicActionData} Action Data
     * @protected
     */
    protected buildActionData(action: Action, context?: RecordLogicContext): RecordLogicActionData {
        return {
            record: (context && context.record) || null,
        } as RecordLogicActionData;
    }

    /**
     * Parse mode actions
     *
     * @param {Action[]} declaredActions Declared Actions
     * @param {ViewMode} mode Mode
     * @returns {Action[]} Logic Actions
     */
    protected parseModeLogicActions(declaredActions: Action[], mode: ViewMode): Action[] {
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

}
