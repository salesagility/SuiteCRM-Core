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

import {isEmpty} from 'lodash-es';
import { Action, Field, isVoid, LogicDefinitions, Record, StringArrayMap, StringArrayMatrix, ViewMode } from 'common';
import {Injectable} from '@angular/core';
import {RecordActionData} from '../../actions/record.action';
import {ActionLogicHandler} from '../../../../services/actions/action-logic-handler';

@Injectable({
    providedIn: 'root'
})
export class RecordActionDisplayTypeLogic extends ActionLogicHandler<RecordActionData> {

    key = 'displayType';
    modes = ['edit', 'detail', 'list', 'create', 'massupdate', 'filter'] as ViewMode[];

    constructor() {
        super();
    }

    runAll(displayLogic: LogicDefinitions, data: RecordActionData): boolean {
        let toDisplay = true;

        const validModeLogic = Object.values(displayLogic).filter(logic => {
            const allowedModes = logic.modes ?? [];
            return !!(allowedModes.length && allowedModes.includes(data.store.getMode()));
        });

        if (!validModeLogic || !validModeLogic.length) {
            return toDisplay;
        }

        let defaultDisplay = data?.action?.display ?? 'show';
        let targetDisplay = 'hide';
        if (defaultDisplay === 'hide') {
            targetDisplay = 'show';
        }

        const isActive = validModeLogic.some(logic => this.run(data, logic as Action));

        if (isActive) {
            defaultDisplay = targetDisplay;
        }

        toDisplay = (defaultDisplay === 'show');

        return toDisplay;
    }

    run(data: RecordActionData, logic: Action): boolean {

        const record = data.store.recordStore.getStaging();
        if (!record || !logic) {
            return true;
        }

        const activeOnFields: StringArrayMap = (logic.params && logic.params.activeOnFields) || {} as StringArrayMap;
        const relatedFields: string[] = Object.keys(activeOnFields);

        const activeOnAttributes: StringArrayMatrix = (logic.params && logic.params.activeOnAttributes) || {} as StringArrayMatrix;
        const relatedAttributesFields: string[] = Object.keys(activeOnAttributes);

        if (!relatedFields.length && !relatedAttributesFields.length) {
            return true;
        }

        return this.isActive(relatedFields, record, activeOnFields, relatedAttributesFields, activeOnAttributes);
    }

    /**
     * Check if any of the configured values is currently set
     *
     * @param {Array} relatedFields Related Fields
     * @param {object} record Record
     * @param {object} activeOnFields Active On Fields
     * @param {Array} relatedAttributesFields Related Attributes Fields
     * @param {object} activeOnAttributes Active On Attributes
     * @returns {boolean} True if any of the configured values is currently set
     */
    protected isActive(
        relatedFields: string[],
        record: Record,
        activeOnFields: StringArrayMap,
        relatedAttributesFields: string[],
        activeOnAttributes: StringArrayMatrix
    ): boolean{
        let isActive = true;
        if (!isEmpty(activeOnFields)) {
            isActive = this.areFieldsActive(relatedFields, record, activeOnFields);
        }

        if (!isEmpty(activeOnAttributes)) {
            isActive = isActive && this.areAttributesActive(relatedAttributesFields, record, activeOnAttributes);
        }


        return isActive;
    }

    /**
     * Are attributes active
     *
     * @param {Array} relatedAttributesFields Related Attributes Fields
     * @param {object} record Record
     * @param {object} activeOnAttributes Active On Attributes
     * @returns {boolean} True if any attributes active exists
     */
    protected areAttributesActive(
        relatedAttributesFields: string[],
        record: Record,
        activeOnAttributes: StringArrayMatrix
    ): boolean {
        return relatedAttributesFields.every(fieldKey => {

            const fields = record.fields;
            const field = (fields && record.fields[fieldKey]) || null;
            const attributes = activeOnAttributes[fieldKey] && Object.keys(activeOnAttributes[fieldKey]);
            if (!field || !attributes || !attributes.length) {
                return;
            }

            return attributes.some(attributeKey => {
                const activeValues = activeOnAttributes[fieldKey][attributeKey];
                const attribute = field.attributes && field.attributes[attributeKey];

                if (!activeValues || !activeValues.length || !attribute) {
                    return;
                }

                return this.isValueActive(attribute, activeValues);
            });
        });
    }

    /**
     * Are fields active
     *
     * @param {Array} relatedFields Related Fields
     * @param {object} record Record
     * @param {object} activeOnFields Active On Fields
     * @returns {boolean} True if there is any fields active
     */
    protected areFieldsActive(relatedFields: string[], record: Record, activeOnFields: StringArrayMap): boolean {
        return relatedFields.every(fieldKey => {

            const fields = record.fields;
            const field = (fields && record.fields[fieldKey]) || null;
            const activeValues = activeOnFields[fieldKey];

            if (!field || !activeValues || !activeValues.length) {
                return true;
            }
            return this.isValueActive(field, activeValues);
        });
    }

    /**
     * Is value active
     *
     * @param {object} field Field
     * @param {Array} activeValues Active Values
     * @returns {boolean} True if there is any value active
     */
    protected isValueActive(field: Field, activeValues: string[]): boolean {
        let isActive = false;

        if (field.valueList && field.valueList.length) {
            field.valueList.some(value => activeValues.some(activeValue => {
                if (activeValue === value) {
                    isActive = true;
                    return true;
                }
            }));

            return isActive;
        }

        if (!isVoid(field.value)) {
            activeValues.some(activeValue => {

                if (activeValue === field.value) {
                    isActive = true;
                }

            });
        }

        return isActive;
    }
}
