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
import {Action, Field, Record, StringArrayMap, StringArrayMatrix, ViewMode} from 'common';
import {FieldLogicActionData, FieldLogicActionHandler} from '../field-logic.action';
import {RequiredValidator} from '../../../services/record/validation/validators/required.validator';

@Injectable({
    providedIn: 'root'
})
export class RequiredAction extends FieldLogicActionHandler {

    key = 'required';
    modes = ['edit', 'create', 'massupdate', 'filter'] as ViewMode[];

    constructor(protected requiredValidator: RequiredValidator) {
        super();
    }

    run(data: FieldLogicActionData, action: Action): void {
        const record = data.record;
        const field = data.field;

        if (!record || !field) {
            return;
        }

        const activeOnFields: StringArrayMap = (action.params && action.params.activeOnFields) || {} as StringArrayMap;
        const relatedFields: string[] = Object.keys(activeOnFields);

        const activeOnAttributes: StringArrayMatrix = (action.params && action.params.activeOnAttributes) || {} as StringArrayMatrix;
        const relatedAttributesFields: string[] = Object.keys(activeOnAttributes);

        if (!relatedFields.length && !relatedAttributesFields.length) {
            return;
        }

        const isActive = this.isActive(relatedFields, record, activeOnFields, relatedAttributesFields, activeOnAttributes);

        let required = false;
        let validators = [...data.field.validators || []];
        if (isActive) {
            required = true;
            validators = validators.concat(this.requiredValidator.getValidator(field));
        }

        data.field.definition.required = required;
        data.field.formControl.setValidators(validators);
        data.field.formControl.updateValueAndValidity({onlySelf: true, emitEvent: true});
        record.formGroup.updateValueAndValidity({onlySelf: true, emitEvent: true});
    }

    /**
     * Check if any of the configured values is currently set
     * @param {array} relatedFields
     * @param {object} record
     * @param {object} activeOnFields
     * @param {array} relatedAttributesFields
     * @param {object} activeOnAttributes
     */
    protected isActive(
        relatedFields: string[],
        record: Record,
        activeOnFields: StringArrayMap,
        relatedAttributesFields: string[],
        activeOnAttributes: StringArrayMatrix
    ) {
        let isActive = this.areFieldsActive(relatedFields, record, activeOnFields);

        if (!isActive) {
            isActive = this.areAttributesActive(relatedAttributesFields, record, activeOnAttributes);
        }

        return isActive;
    }

    /**
     * Are attributes active
     * @param {array} relatedAttributesFields
     * @param {object} record
     * @param {object} activeOnAttributes
     */
    protected areAttributesActive(
        relatedAttributesFields: string[],
        record: Record,
        activeOnAttributes: StringArrayMatrix
    ): boolean {
        return relatedAttributesFields.some(fieldKey => {

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
     * @param {array} relatedFields
     * @param {object} record
     * @param {object} activeOnFields
     */
    protected areFieldsActive(relatedFields: string[], record: Record, activeOnFields: StringArrayMap): boolean {
        return relatedFields.some(fieldKey => {

            const fields = record.fields;
            const field = (fields && record.fields[fieldKey]) || null;
            const activeValues = activeOnFields[fieldKey];

            if (!field || !activeValues || !activeValues.length) {
                return;
            }

            return this.isValueActive(field, activeValues);
        });
    }

    /**
     * Is value active
     * @param {object} field
     * @param {array} activeValues
     */
    protected isValueActive(field: Field, activeValues: string[]): boolean {
        let isActive = false;

        if (field.valueList && field.valueList.length) {
            field.valueList.some(value => {
                return activeValues.some(activeValue => {
                    if (activeValue === value) {
                        isActive = true;
                        return true;
                    }
                });
            });

            return isActive;
        }

        if (field.value) {
            activeValues.some(activeValue => {

                if (activeValue === field.value) {
                    isActive = true;
                }

            });
        }

        return isActive;
    }
}
