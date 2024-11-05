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
import {BaseActionManager} from '../../services/actions/base-action-manager.service';
import {FieldLogicDisplayActionData} from './field-logic-display.action';
import {Action, ActionContext, Field, Record, ViewMode, DisplayType} from 'common';
import {DisplayTypeAction} from './display-type/display-type.action';

@Injectable({
    providedIn: 'root'
})
export class FieldLogicDisplayManager extends BaseActionManager<FieldLogicDisplayActionData> {

    constructor(
        displayType: DisplayTypeAction,
    ) {
        super();
        displayType.modes.forEach(mode => this.actions[mode][displayType.key] = displayType);
    }

    runAll(field: Field, record: Record, mode: ViewMode): void {
        if (!field.displayLogic) {
            return;
        }

        // 1. Set default display 
        const defaultDisplay: DisplayType = (field.defaultDisplay ?? "show") as DisplayType;

        // 2. Set target display
        let targetDisplay: DisplayType = null;

        // 2-1. Get valid mode logics - only the mode logics relevant to the current 'mode'
        const validModeLogics = Object.values(field.displayLogic).filter(logic => {
            const allowedModes = logic['modes'] ?? [];
            return !!(allowedModes.length && allowedModes.includes(mode));
        });
        if (validModeLogics.length === 0) {
            return;
        }

        // 2-2. Set target display by applying the valid mode logics
        const context = {
            record,
            field,
            module: record.module
        } as ActionContext;        
        for (const modeLogic of validModeLogics) {
            const data: FieldLogicDisplayActionData = this.buildActionData(modeLogic, context);
            const isModeLogicActive: boolean = Boolean(this.actions[mode][modeLogic.key].run(data, modeLogic));
            // Take targetDisplayType of the last mode logic by overwriting targetDisplay in case there are multiple active mode logics
            if (isModeLogicActive) {
                targetDisplay = modeLogic['params']['targetDisplayType'];
            }
        }

        // 3. Set field display
        field.display = targetDisplay === null ? defaultDisplay : targetDisplay; 
    }

    protected buildActionData(action: Action, context?: ActionContext): FieldLogicDisplayActionData {
        return {
            field: context.field,
            record: (context && context.record) || null,
        } as FieldLogicDisplayActionData;
    }

}
