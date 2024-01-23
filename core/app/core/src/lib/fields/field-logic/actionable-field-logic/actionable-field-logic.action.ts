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

import {isArray, isString} from 'lodash-es';
import {
    Action,
    ALL_VIEW_MODES,
    Field,
    Record,
} from 'common';
import { FieldLogicActionData, FieldLogicActionHandler } from '../field-logic.action';
import {ActiveLogicChecker} from '../../../services/logic/active-logic-checker.service';

export type FieldValueTypes = string | string[] | object;

export abstract class ActionableFieldLogicActionHandler extends FieldLogicActionHandler {
    modes = ALL_VIEW_MODES;

    protected constructor(
        protected activeLogicChecker: ActiveLogicChecker
    ) {
        super();
    }

    run(data: FieldLogicActionData, action: Action): void {
        const record = data.record;
        const field = data.field;
        if (!record || !field) {
            return;
        }
        const params = action.params ?? {};

        const logicIsActive = this.activeLogicChecker.run(record, action);

        this.executeLogic(logicIsActive, params, field, record);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    shouldDisplay(data: FieldLogicActionData): boolean {
        return true;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    executeLogic(logicIsActive: boolean, params: { [p: string]: any }, field: Field, record: Record): void {
    }

    protected updateValue(value: FieldValueTypes, field: Field, record: Record): void {
        if (isString(value)) {
            field.value = value;
        } else if (isArray(value)) {
            field.valueList = value;
        } else {
            field.valueObject = value;
        }

        field.formControl.setValue(value);

        // re-validate the parent form-control after value update
        record.formGroup.updateValueAndValidity({onlySelf: true, emitEvent: true});
    }
}
