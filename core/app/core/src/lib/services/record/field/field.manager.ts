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

import {Field, FieldDefinition, Record, ViewFieldDefinition} from 'common';
import {LanguageStore} from '../../../store/language/language.store';
import {Injectable} from '@angular/core';
import {SavedFilter} from '../../../store/saved-filters/saved-filter.model';
import {FieldBuilder} from './field.builder';
import {GroupFieldBuilder} from './group-field.builder';
import {AttributeBuilder} from './attribute.builder';
import {FilterFieldBuilder} from './filter-field.builder';
import {FilterAttributeBuilder} from './filter-attribute.builder';
import {LineItemBuilder} from './line-item.builder';
import {FormGroup} from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class FieldManager {

    constructor(
        protected fieldBuilder: FieldBuilder,
        protected groupFieldBuilder: GroupFieldBuilder,
        protected attributeBuilder: AttributeBuilder,
        protected filterFieldBuilder: FilterFieldBuilder,
        protected filterAttributeBuilder: FilterAttributeBuilder,
        protected lineItemBuilder: LineItemBuilder,
        protected languageStore: LanguageStore
    ) {
    }

    /**
     * Build minimally initialised field object
     *
     * @param {string} type field type
     * @param {string} value field value
     * @returns {object} Field
     */
    public buildShallowField(type: string, value: string): Field {
        return {
            type,
            value,
            definition: {
                type
            }
        } as Field;
    }

    /**
     * Build and add field to record
     *
     * @param {object} record Record
     * @param {object} viewField ViewFieldDefinition
     * @param {object} language LanguageStore
     * @returns {object}Field
     */
    public addField(record: Record, viewField: ViewFieldDefinition, language: LanguageStore = null): Field {

        const field = this.fieldBuilder.buildField(record, viewField, language);

        this.addToRecord(record, viewField.name, field);
        this.groupFieldBuilder.addGroupFields(
            record,
            viewField,
            language,
            this.isFieldInitialized.bind(this),
            this.fieldBuilder.buildField.bind(this.fieldBuilder),
            this.addToRecord.bind(this)
        );

        this.attributeBuilder.addAttributes(
            record,
            record.fields,
            viewField,
            language,
            this.attributeBuilder.buildAttribute.bind(this.attributeBuilder),
            this.attributeBuilder.addAttributeToRecord.bind(this.attributeBuilder)
        );

        this.lineItemBuilder.addLineItems(
            record,
            record.fields,
            viewField,
            language,
            this.addField.bind(this),
        );

        return field;
    }


    /**
     * Build and add filter field to record
     *
     * @param {object} record Record
     * @param {object} viewField ViewFieldDefinition
     * @param {object} language LanguageStore
     * @returns {object}Field
     */
    public addFilterField(record: SavedFilter, viewField: ViewFieldDefinition, language: LanguageStore = null): Field {

        const field = this.filterFieldBuilder.buildFilterField(record, viewField, language);

        this.filterFieldBuilder.addToSavedFilter(record, viewField.name, field);
        this.groupFieldBuilder.addGroupFields(
            record,
            viewField,
            language,
            this.filterFieldBuilder.isCriteriaFieldInitialized.bind(this.filterFieldBuilder),
            this.filterFieldBuilder.buildFilterField.bind(this.filterFieldBuilder),
            this.filterFieldBuilder.addToSavedFilter.bind(this.filterFieldBuilder)
        );

        this.attributeBuilder.addAttributes(
            record,
            record.criteriaFields,
            viewField,
            language,
            this.filterAttributeBuilder.buildFilterAttribute.bind(this.filterAttributeBuilder),
            this.filterAttributeBuilder.addAttributeToSavedFilter.bind(this.filterAttributeBuilder)
        );

        return field;
    }

    /**
     * Build line item and add to record
     * @param {object} itemDefinition
     * @param {object }item
     * @param {object} parentRecord
     * @param {object} parentField
     */
    public addLineItem(
        itemDefinition: FieldDefinition,
        parentRecord: Record,
        parentField: Field,
        item: Record = null
    ) {
        if (!item) {
            item = {
                id: '',
                module: parentField.definition.module || '',
                attributes: {},
                fields: {},
                formGroup: new FormGroup({}),
            } as Record;
        }

        this.lineItemBuilder.addLineItem(
            itemDefinition,
            item,
            this.addField.bind(this),
            this.languageStore,
            parentRecord,
            parentField
        );

        parentField.itemFormArray.updateValueAndValidity();
    }

    /**
     * Remove line item
     * @param {object} parentField
     * @param index
     */
    public removeLineItem(parentField: Field, index: number) {
        const item = parentField.items[index];

        if (!item) {
            return;
        }

        if (item.id) {
            item.attributes.deleted = 1;
        } else {
            parentField.items = (index > -1) ? [
                ...parentField.items.slice(0, index),
                ...parentField.items.slice(index + 1)
            ] : parentField.items;
        }

        parentField.itemFormArray.clear();

        parentField.items.forEach(item => {
            const deleted = item && item.attributes && item.attributes.deleted;
            if (!item || deleted) {
                return;
            }

            parentField.itemFormArray.push(item.formGroup);
        });

        parentField.itemFormArray.updateValueAndValidity();
    }


    /**
     * Add field to record
     *
     * @param {object} record Record
     * @param {string} name string
     * @param {object} field Field
     */
    public addToRecord(record: Record, name: string, field: Field): void {

        if (!record || !name || !field) {
            return;
        }

        if (!record.fields) {
            record.fields = {};
        }

        record.fields[name] = field;

        if (record.formGroup && field.itemFormArray) {
            record.formGroup.addControl(name + '-items', field.itemFormArray);
        }

        if (record.formGroup && field.formControl) {
            record.formGroup.addControl(name, field.formControl);
        }
    }


    /**
     * Is field initialized in record
     *
     * @param {object} record Record
     * @param {string} fieldName field
     * @returns {boolean} isInitialized
     */
    protected isFieldInitialized(record: Record, fieldName: string): boolean {
        return !!record.fields[fieldName];
    }

}
