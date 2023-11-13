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
import { isArray, isEmpty } from 'lodash-es';
import { Injectable } from '@angular/core';
import {
    Record,
    Action,
    Field,
    StringArrayMap,
    StringArrayMatrix,
    ViewMode,
    FieldAttribute,
    ALL_VIEW_MODES,
    LogicRuleValues,
} from 'common';
import { ConditionOperatorManager } from '../condition-operators/condition-operator.manager';

@Injectable({
    providedIn: 'root',
})
export class ActiveLogicChecker {

    modes: ViewMode[] = ALL_VIEW_MODES;

    constructor(
        protected operatorManager: ConditionOperatorManager
    ) {
    }

    public run(record: Record, action: Action): boolean {
        if (!record || !action) {
            return true;
        }

        const activeOnFields: StringArrayMap = action.params?.activeOnFields || {};

        const activeOnAttributes: StringArrayMatrix = action.params?.activeOnAttributes || {};

        return this.isActive(record, activeOnFields, activeOnAttributes);
    }

    /**
     * Check if any of the configured values is currently set
     *
     * @param {Record} record Record
     * @param {StringArrayMap} activeOnFields Active On Fields
     * @param {StringArrayMatrix} activeOnAttributes Active On Attributes
     * @returns {boolean} true if any of the configured values is currently set
     */
    protected isActive(
        record: Record,
        activeOnFields: StringArrayMap,
        activeOnAttributes: StringArrayMatrix
    ): boolean {
        let isActive = true;
        if (!isEmpty(activeOnFields)) {
            isActive = isActive && this.areFieldsActive(record, activeOnFields);
        }
        if (!isEmpty(activeOnAttributes)) {
            isActive = isActive && this.areAttributesActive(record, activeOnAttributes);
        }

        return isActive;
    }

    /**
     * Are fields active
     *
     * @param {Record} record Record
     * @param {StringArrayMap} activeOnFields StringArrayMap
     * @returns {boolean} true are fields active
     */
    protected areFieldsActive(record: Record, activeOnFields: StringArrayMap): boolean {
        let areActive = true;

        Object.entries(activeOnFields).forEach(([fieldKey, activeValues]) => {
            if (!areActive) {
                return;
            }

            const field = (record.fields ?? {})[fieldKey] ?? null;
            if (!field || isEmpty(activeValues)) {
                return;
            }

            areActive = this.isValueActive(record, field, activeValues);
        });

        return areActive;
    }

    /**
     * Are attributes active
     *
     * @param {Record} record Record
     * @param {StringArrayMatrix} activeOnAttributes Active On Attributes
     * @returns {boolean} true if are attributes active
     */
    protected areAttributesActive(record: Record, activeOnAttributes: StringArrayMatrix): boolean {
        let areActive = true;

        Object.entries(activeOnAttributes).forEach(([fieldKey, attributesMap]) => {
            if (!areActive) {
                return;
            }

            const field = (record.fields ?? {})[fieldKey] ?? null;
            if (!field || isEmpty(attributesMap)) {
                return;
            }

            Object.entries(attributesMap).forEach(([attributeKey, activeValues]) => {
                if (!areActive) {
                    return;
                }

                const attribute = (field.attributes ?? {})[attributeKey] ?? null;
                if (!attribute || isEmpty(activeValues)) {
                    return;
                }

                areActive = this.isValueActive(record, attribute, activeValues);
            });
        });

        return areActive;
    }

    /**
     * Is value active
     *
     * @param {Record} record Record
     * @param {Field | FieldAttribute} value Value
     * @param {Array | any} activeValueOrValues Active Value Or Values
     * @returns {boolean} true if is value active
     */
    protected isValueActive(
        record: Record,
        value: Field | FieldAttribute,
        activeValueOrValues: string | LogicRuleValues | Array<string | LogicRuleValues>
    ): boolean {
        const activeValues = isArray(activeValueOrValues) ? activeValueOrValues : [activeValueOrValues];

        const toCompareValueList = !isEmpty(value.valueList)
            ? value.valueList
            : [value.value];

        return activeValues.some(activeValue => {
            if (typeof activeValue === 'string') {
                return toCompareValueList.some(toCompareValue => activeValue === toCompareValue);
            }

            const operatorKey = activeValue.operator ?? '';
            const operator = this.operatorManager.get(operatorKey);
            if (!operator) {
                console.warn(`ActiveLogicChecker.isValueActive: Operator: '${operatorKey}' not found.`);
            }
            return operator?.run(record, value, activeValue);
        });
    }
}
