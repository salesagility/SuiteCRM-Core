/**
 * @author SalesAgility <info@salesagility.com>.
 */

import {Injectable} from '@angular/core';
import {Field, Record, ViewMode} from 'common';
import {isEmpty} from 'lodash-es';
import {ActionableFieldLogicActionHandler} from '../actionable-field-logic/actionable-field-logic.action';
import {ActiveLogicChecker} from '../../../services/logic/active-logic-checker.service';

interface IUpdateFieldParams {
    nonActiveValue?: string;
    activeValue?: string;
    nonActiveValues?: string[];
    activeValues?: string[];
}

@Injectable({
    providedIn: 'root'
})
export class UpdateFieldAction extends ActionableFieldLogicActionHandler {

    key = 'updateField';
    modes = ['edit', 'create', 'massupdate'] as ViewMode[];

    constructor(
        protected activeLogicChecker: ActiveLogicChecker,
    ) {
        super(activeLogicChecker);
    }

    executeLogic(logicIsActive: boolean, params: IUpdateFieldParams, field: Field, record: Record): void {
        const activeValue = params.activeValue ?? '';
        const nonActiveValue = params.nonActiveValue ?? '';
        if (logicIsActive && !isEmpty(activeValue)) {
            this.updateValue(activeValue, field, record);
        } else if (!logicIsActive && !isEmpty(nonActiveValue)) {
            this.updateValue(nonActiveValue, field, record);
        }

        const activeValues = params.activeValues ?? [];
        const nonActiveValues = params.nonActiveValues ?? [];
        if (logicIsActive && !isEmpty(activeValues)) {
            this.updateValueList(activeValues, field, record);
        } else if (!logicIsActive && !isEmpty(nonActiveValues)) {
            this.updateValueList(nonActiveValues, field, record);
        }
    }
}
