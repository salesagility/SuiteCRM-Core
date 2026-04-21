/**
 * SuiteCRM is a customer relationship management program developed by SuiteCRM Ltd.
 * Copyright (C) 2026 SuiteCRM Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SUITECRM, SUITECRM DISCLAIMS THE
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
import {
    RecordLogicActionData,
    RecordLogicActionHandler,
    RecordLogicActionHandlerMap,
    RecordLogicMap
} from './record-logic.action';
import {Action, ActionContext, ModeActions} from '../../../common/actions/action.model';
import {Record} from '../../../common/record/record.model';
import {ViewMode} from '../../../common/views/view.model';
import {UpdateValuesBackendAction} from './update-values-backend/update-values-backend.action';

@Injectable({
    providedIn: 'root'
})
export class RecordLogicManager extends BaseActionManager<RecordLogicActionData> {

    actions: { [key: string]: RecordLogicActionHandlerMap } = {
        edit: {} as RecordLogicActionHandlerMap,
        create: {} as RecordLogicActionHandlerMap,
        list: {} as RecordLogicActionHandlerMap,
        detail: {} as RecordLogicActionHandlerMap,
        massupdate: {} as RecordLogicActionHandlerMap,
        filter: {} as RecordLogicActionHandlerMap
    };

    constructor(updateValuesBackend: UpdateValuesBackendAction) {
        super();
        updateValuesBackend.modes.forEach(mode => this.actions[mode][updateValuesBackend.key] = updateValuesBackend);
    }

    registerAction(handler: RecordLogicActionHandler): void {
        handler.modes.forEach(mode => this.actions[mode][handler.key] = handler);
    }

    runLogic(record: Record, mode: ViewMode, config: RecordLogicMap, triggeringStatus: string, changedFieldName: string = ''): void {
        if (!config || !Object.keys(config).length) {
            return;
        }

        const declaredActions = Object.keys(config).map(key => config[key]);
        const modeActions = this.parseModeActions(declaredActions, mode, triggeringStatus, changedFieldName);

        const context = {
            record,
            module: record.module
        } as ActionContext;

        modeActions.forEach(action => {
            this.runFrontEndAction(action, mode, context, changedFieldName);
        });
    }

    protected runFrontEndAction(action: Action, mode: ViewMode, context: ActionContext, changedFieldName: string): void {
        const data: RecordLogicActionData = this.buildActionData(action, context, changedFieldName);
        this.run(action, mode, data);
    }

    protected getModuleName(context?: ActionContext): string {
        return context.module;
    }

    protected buildActionData(action: Action, context?: ActionContext, changedFieldName?: string): RecordLogicActionData {
        const record = (context && context.record) || null;
        const changedField = (record && changedFieldName && record.fields?.[changedFieldName]) || null;

        return {
            record,
            changedField,
            changedFieldName: changedFieldName || ''
        } as RecordLogicActionData;
    }

    protected parseModeActions(declaredActions: Action[], mode: ViewMode, triggeringStatus: string, changedFieldName: string): Action[] {
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

        declaredActions.forEach(action => {
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

        const actions = [];
        const defaultTriggeringStatus = ['onDependencyChange'];

        availableActions[mode].forEach(action => {
            let dependentFieldsKeys: string[] = action?.params?.fieldDependencies ?? [];
            if (!dependentFieldsKeys.length) {
                dependentFieldsKeys = Object.keys(action?.params?.activeOnFields ?? {});
            }

            const frontendActionTriggeringStatus = this?.actions[mode][action.key]?.getTriggeringStatus() ?? null;
            const actionTriggeringStatus = action?.triggeringStatus ?? frontendActionTriggeringStatus ?? defaultTriggeringStatus;

            if (triggeringStatus === 'onRecordInit' && actionTriggeringStatus.includes('onRecordInit')) {
                actions.push(action);
                return;
            }

            if (triggeringStatus === 'onRecordInit' && !actionTriggeringStatus.includes('onRecordInit')) {
                return;
            }

            if (actionTriggeringStatus.includes('onDependencyChange') && changedFieldName) {
                if (!dependentFieldsKeys.includes(changedFieldName)) {
                    return;
                }
            }

            actions.push(action);
        });

        return actions;
    }
}
