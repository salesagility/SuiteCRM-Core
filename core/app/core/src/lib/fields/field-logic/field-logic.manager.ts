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
import {BaseActionManager} from '../../services/actions/base-action-manager.service';
import {FieldLogicActionData} from './field-logic.action';
import {Action, ActionContext, Field, ModeActions, Record, ViewMode} from 'common';
import {DisplayTypeAction} from './display-type/display-type.action';
import {EmailPrimarySelectAction} from './email-primary-select/email-primary-select.action';
import {RequiredAction} from './required/required.action';
import {UpdateBaseCurrencyAction} from './currency-conversion/update-base-currency.action';
import {UpdateCurrencyAction} from './currency-conversion/update-currency.action';
import {UpdateFlexRelateModuleAction} from './update-flex-relate-module/update-flex-relate-module.action';

@Injectable({
    providedIn: 'root'
})
export class FieldLogicManager extends BaseActionManager<FieldLogicActionData> {

    constructor(
        displayType: DisplayTypeAction,
        emailPrimarySelectAction: EmailPrimarySelectAction,
        required: RequiredAction,
        updateBaseCurrency: UpdateBaseCurrencyAction,
        updateCurrency: UpdateCurrencyAction,
        updateFlexRelateModule: UpdateFlexRelateModuleAction
    ) {
        super();
        displayType.modes.forEach(mode => this.actions[mode][displayType.key] = displayType);
        emailPrimarySelectAction.modes.forEach(mode => this.actions[mode][emailPrimarySelectAction.key] = emailPrimarySelectAction);
        required.modes.forEach(mode => this.actions[mode][required.key] = required);
        updateBaseCurrency.modes.forEach(mode => this.actions[mode][updateBaseCurrency.key] = updateBaseCurrency);
        updateCurrency.modes.forEach(mode => this.actions[mode][updateCurrency.key] = updateCurrency);
        updateFlexRelateModule.modes.forEach(mode => this.actions[mode][updateFlexRelateModule.key] = updateFlexRelateModule);
    }

    /**
     * Run logic for the given field
     * @param {object} field
     * @param {object} mode
     * @param {object} record
     */
    runLogic(field: Field, mode: ViewMode, record: Record): void {
        if (!field.logic) {
            return;
        }

        const actions = Object.keys(field.logic).map(key => field.logic[key]);

        const modeActions = this.parseModeActions(actions, mode);
        const context = {
            record,
            field,
            module: record.module
        } as ActionContext;

        modeActions.forEach(action => {
            this.runAction(action, mode, context);
        });
    }

    /**
     * Run the action using given context
     * @param action
     * @param mode
     * @param context
     */
    runAction(action: Action, mode: ViewMode, context: ActionContext = null): void {
        this.runFrontEndAction(action, mode, context);
    }


    /**
     * Run front end action
     * @param {object} action
     * @param {object} mode
     * @param {object} context
     */
    protected runFrontEndAction(action: Action, mode: ViewMode, context: ActionContext = null): void {
        const data: FieldLogicActionData = this.buildActionData(action, context);

        this.run(action, mode, data);
    }

    /**
     * Get module name
     * @param {object} context
     */
    protected getModuleName(context?: ActionContext): string {
        return context.module;
    }

    protected buildActionData(action: Action, context?: ActionContext): FieldLogicActionData {
        return {
            field: context.field,
            record: (context && context.record) || null,
        } as FieldLogicActionData;
    }

    /**
     * Parse mode actions
     * @param declaredActions
     * @param mode
     */
    protected parseModeActions(declaredActions: Action[], mode: ViewMode) {
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
