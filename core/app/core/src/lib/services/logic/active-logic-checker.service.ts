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
import {isEmpty} from 'lodash-es';
import {
    Record,
    Action,
    Field,
    StringArrayMap,
    StringArrayMatrix,
    ViewMode
} from 'common';


@Injectable({
    providedIn: 'root'
})
export class ActiveLogicChecker {

    modes = ['edit', 'detail', 'list', 'create', 'massupdate', 'filter'] as ViewMode[];

    constructor() {
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
     * @param {object} record
     * @param {object} activeOnFields
     * @param {object} activeOnAttributes
     */
    protected isActive(
        record: Record,
        activeOnFields: StringArrayMap,
        activeOnAttributes: StringArrayMatrix
    ) {
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
     * @param {object} record
     * @param {object} activeOnFields
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
     * @param {object} record
     * @param {object} activeOnAttributes
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
            })
        })

        return areActive;
    }

    /**
     * Is value active
     * @param {Record} record
     * @param {object} field
     * @param {array} activeValues
     */
    protected isValueActive(record: Record, field: Field, activeValues: string[] | any): boolean {
        const acVaArray = Array.isArray(activeValues) ? activeValues : [activeValues];

        const fieldValueList = field.valueList ?? [];

        return acVaArray.some(activeValue => {
            if (fieldValueList.length) {
                return fieldValueList.some(value => value === activeValue);
            }

            return activeValue === field.value
        });
    }
}
