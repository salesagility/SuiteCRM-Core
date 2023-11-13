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
import {AttributeMap, EDITABLE_VIEW_MODES, Field, Record} from 'common';
import {
    ActionableFieldLogicActionHandler,
    FieldValueTypes
} from '../actionable-field-logic/actionable-field-logic.action';
import {ActiveLogicChecker} from '../../../services/logic/active-logic-checker.service';
import {map, take} from 'rxjs/operators';
import {RecordFetchGQL} from '../../../store/record/graphql/api.record.get';
import {Observable, of} from 'rxjs';
import {isString} from 'lodash-es';


type RelatedFieldParamType = string | {
    linkFieldName: string;
    toCopyFromFieldName: string;
};

interface RelatedFieldParams {
    nonActiveState?: RelatedFieldParamType;
    activeState?: RelatedFieldParamType;
}

@Injectable({
    providedIn: 'root'
})
export class SetFieldFromRelatedAction extends ActionableFieldLogicActionHandler {

    key = 'setFromRelated';
    modes = EDITABLE_VIEW_MODES;

    constructor(
        protected activeLogicChecker: ActiveLogicChecker,
        protected recordFetchGQL: RecordFetchGQL
    ) {
        super(activeLogicChecker);
    }

    executeLogic(logicIsActive: boolean, params: RelatedFieldParams, field: Field, record: Record): void {
        this.getToUpdateValue(logicIsActive, params, record)
            .pipe(take(1))
            .subscribe((toUpdateValue) => {
                if (toUpdateValue === null) {
                    return;
                }

                this.updateValue(toUpdateValue, field, record);
            });
    }

    private getToUpdateValue(logicIsActive: boolean, params: RelatedFieldParams, record: Record): Observable<FieldValueTypes | null> {
        const paramAccordingToLogicState = logicIsActive
            ? params.activeState
            : params.nonActiveState;
        const relatedFieldParam = paramAccordingToLogicState ?? null;

        if (relatedFieldParam === null) {
            return of(null);
        }

        if (isString(relatedFieldParam)) {
            return of(relatedFieldParam);
        }

        const toCopyFromFieldName = relatedFieldParam.toCopyFromFieldName;
        if (!toCopyFromFieldName) {
            return of(null);
        }

        const linkFieldName = relatedFieldParam.linkFieldName;
        const relatedIdNameField = record.fields[linkFieldName];
        const relatedIdField = record.fields[relatedIdNameField.definition.id_name];
        if (!relatedIdField) {
            return of(null);
        }

        const module: string = relatedIdField.definition.module;
        const recordId: string = relatedIdField.value;

        return this.getRecordAttributes(module, recordId).pipe(
            map((recordAttributes): (FieldValueTypes | null) => (recordAttributes[toCopyFromFieldName] ?? null))
        );
    }

    private getRecordAttributes(module: string, recordId: string): Observable<AttributeMap> {
        const fields: string[] = ['_id', 'attributes'];

        return this.recordFetchGQL.fetch(module, recordId, {fields}).pipe(
            map((result): AttributeMap => (result?.data?.getRecord?.attributes ?? {}))
        );
    }
}
