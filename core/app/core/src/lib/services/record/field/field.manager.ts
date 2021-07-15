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

import {
    AttributeDependency,
    BaseField,
    deepClone,
    Field,
    FieldAttribute,
    FieldDefinition,
    FieldLogic,
    FieldMap,
    Record,
    SearchCriteria,
    SearchCriteriaFieldFilter,
    StringMap,
    ViewFieldDefinition
} from 'common';
import {LanguageStore} from '../../../store/language/language.store';
import {AsyncValidatorFn, FormControl, ValidatorFn} from '@angular/forms';
import {Injectable} from '@angular/core';
import {ValidationManager} from '../validation/validation.manager';
import {DataTypeFormatter} from '../../formatters/data-type.formatter.service';
import {SavedFilter} from '../../../store/saved-filters/saved-filter.model';
import get from 'lodash-es/get';
import isObjectLike from 'lodash-es/isObjectLike';

@Injectable({
    providedIn: 'root'
})
export class FieldManager {

    constructor(protected validationManager: ValidationManager, protected typeFormatter: DataTypeFormatter) {
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

        const field = this.buildField(record, viewField, language);

        this.addToRecord(record, viewField.name, field);
        this.addGroupFields(
            record,
            viewField,
            language,
            this.isFieldInitialized.bind(this),
            this.buildField.bind(this),
            this.addToRecord.bind(this)
        );

        this.addAttributes(
            record,
            record.fields,
            viewField,
            language,
            this.buildAttribute.bind(this),
            this.addAttributeToRecord.bind(this)
        );

        return field;
    }

    /**
     * Build field
     *
     * @param {object} record Record
     * @param {object} viewField ViewFieldDefinition
     * @param {object} language LanguageStore
     * @returns {object}Field
     */
    public buildField(record: Record, viewField: ViewFieldDefinition, language: LanguageStore = null): Field {

        const definition = (viewField && viewField.fieldDefinition) || {} as FieldDefinition;
        const {value, valueList, valueObject} = this.parseValue(viewField, definition, record);
        const {validators, asyncValidators} = this.getSaveValidators(record, viewField);

        return this.setupField(
            record.module,
            viewField,
            value,
            valueList,
            valueObject,
            record,
            definition,
            validators,
            asyncValidators,
            language
        );
    }

    /**
     * Build field
     *
     * @param {object} record Record
     * @param {object} parentField Field
     * @param {object} viewField ViewFieldDefinition
     * @param {object} language LanguageStore
     * @returns {object} FieldAttribute
     */
    public buildAttribute(record: Record, parentField: Field, viewField: ViewFieldDefinition, language: LanguageStore = null): FieldAttribute {

        const definition = (viewField && viewField.fieldDefinition) || {} as FieldDefinition;
        const {value, valueList, valueObject} = this.parseAttributeValue(viewField, definition, record, parentField);
        const {validators, asyncValidators} = this.getSaveValidators(record, viewField);

        const field = this.setupField(
            record.module,
            viewField,
            value,
            valueList,
            valueObject,
            record,
            definition,
            validators,
            asyncValidators,
            language
        );

        const fieldAttribute = field as FieldAttribute;
        fieldAttribute.valuePath = definition.valuePath;
        fieldAttribute.source = 'attribute';
        fieldAttribute.parentKey = parentField.name;

        return fieldAttribute;
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

        const field = this.buildFilterField(record, viewField, language);

        this.addToSavedFilter(record, viewField.name, field);
        this.addGroupFields(
            record,
            viewField,
            language,
            this.isCriteriaFieldInitialized.bind(this),
            this.buildFilterField.bind(this),
            this.addToSavedFilter.bind(this)
        );

        field.criteria = this.initFieldFilter(record.criteria, viewField, field);

        this.addAttributes(
            record,
            record.criteriaFields,
            viewField,
            language,
            this.buildFilterAttribute.bind(this),
            this.addAttributeToSavedFilter.bind(this)
        );

        return field;
    }

    /**
     * Build filter field
     *
     * @param {object} savedFilter SavedFilter
     * @param {object} viewField ViewFieldDefinition
     * @param {object} language LanguageStore
     * @returns {object} Field
     */
    public buildFilterField(savedFilter: SavedFilter, viewField: ViewFieldDefinition, language: LanguageStore = null): Field {

        const definition = (viewField && viewField.fieldDefinition) || {} as FieldDefinition;
        const {validators, asyncValidators} = this.getFilterValidators(savedFilter, viewField);

        return this.setupField(
            savedFilter.searchModule,
            viewField,
            null,
            null,
            null,
            savedFilter,
            definition,
            validators,
            asyncValidators,
            language
        );
    }

    /**
     * Build filter attribute
     *
     * @param {object} savedFilter SavedFilter
     * @param {object} parentField Field
     * @param {object} viewField ViewFieldDefinition
     * @param {object} language LanguageStore
     * @returns {object} FieldAttribute
     */
    public buildFilterAttribute(
        savedFilter: SavedFilter,
        parentField: Field,
        viewField: ViewFieldDefinition,
        language: LanguageStore = null
    ): FieldAttribute {

        const definition = (viewField && viewField.fieldDefinition) || {} as FieldDefinition;

        if (!definition.valuePath) {
            definition.valuePath = 'criteria.' + (viewField.name || definition.name);
        }

        const {value, valueList, valueObject} = this.parseFilterAttributeValue(viewField, definition, savedFilter, parentField);
        const {validators, asyncValidators} = this.getFilterValidators(savedFilter, viewField);

        const field = this.setupField(
            savedFilter.searchModule,
            viewField,
            value,
            valueList,
            valueObject,
            savedFilter,
            definition,
            validators,
            asyncValidators,
            language
        );

        const fieldAttribute = field as FieldAttribute;
        fieldAttribute.valuePath = definition.valuePath;
        fieldAttribute.source = 'attribute';
        fieldAttribute.parentKey = parentField.definition.name;

        return fieldAttribute;
    }

    /**
     * Init filter fields
     *
     * @param {object} searchCriteria to use
     * @param {object} viewField to init
     * @param {object} field to init
     * @returns {object} SearchCriteriaFieldFilter
     */
    protected initFieldFilter(searchCriteria: SearchCriteria, viewField: ViewFieldDefinition, field: Field): SearchCriteriaFieldFilter {
        let fieldCriteria: SearchCriteriaFieldFilter;

        const fieldName = viewField.name;
        let fieldType = viewField.type;

        if (fieldType === 'composite') {
            fieldType = field.definition.type;
        }

        if (searchCriteria.filters[fieldName]) {
            fieldCriteria = deepClone(searchCriteria.filters[fieldName]);
        } else {
            fieldCriteria = {
                field: fieldName,
                fieldType,
                operator: '',
                values: []
            };
        }

        return fieldCriteria;
    }

    public getFieldLabel(label: string, module: string, language: LanguageStore): string {
        const languages = language.getLanguageStrings();
        return language.getFieldLabel(label, module, languages);
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

        if (record.formGroup && field.formControl) {
            record.formGroup.addControl(name, field.formControl);
        }
    }

    /**
     * Add field to SavedFilter
     *
     * @param {object} savedFilter SavedFilter
     * @param {string} name string
     * @param {object} field Field
     */
    public addToSavedFilter(savedFilter: SavedFilter, name: string, field: Field): void {

        if (!savedFilter || !name || !field) {
            return;
        }

        if (!savedFilter.criteriaFields) {
            savedFilter.criteriaFields = {};
        }

        savedFilter.criteriaFields[name] = field;

        if (savedFilter.criteriaFormGroup && field.formControl) {
            savedFilter.criteriaFormGroup.addControl(name, field.formControl);
        }
    }

    /**
     * Add attribute to record
     *
     * @param {object} record Record
     * @param {object} field Field
     * @param {string} name string
     * @param {object} attribute FieldAttribute
     */
    public addAttributeToRecord(record: Record, field: Field, name: string, attribute: FieldAttribute): void {

        if (!record || !name || !field || !attribute) {
            return;
        }

        field.attributes = field.attributes || {};

        field.attributes[name] = field;

        if (record.formGroup && attribute.formControl) {
            record.formGroup.addControl(name, attribute.formControl);
        }

    }

    /**
     * Add attribute to SavedFilter
     *
     * @param {object} savedFilter SavedFilter
     * @param {object} field Field
     * @param {string} name string
     * @param {object} attribute FieldAttribute
     */
    public addAttributeToSavedFilter(savedFilter: SavedFilter, field: Field, name: string, attribute: FieldAttribute): void {

        if (!savedFilter || !name || !field || !attribute) {
            return;
        }

        field.attributes = field.attributes || {};

        field.attributes[name] = attribute;

        if (savedFilter.criteriaFormGroup && attribute.formControl) {
            savedFilter.criteriaFormGroup.addControl(name, attribute.formControl);
        }
    }

    /**
     * Create and add group fields to record
     *
     * @param {object} record Record
     * @param {object} viewField ViewFieldDefinition
     * @param {object} language LanguageStore
     * @param {function} isInitializedFunction
     * @param {function} buildFieldFunction
     * @param {function} addRecordFunction
     */
    protected addGroupFields(
        record: Record,
        viewField: ViewFieldDefinition,
        language: LanguageStore,
        isInitializedFunction: Function,
        buildFieldFunction: Function,
        addRecordFunction: Function,
    ): void {

        const definition = (viewField && viewField.fieldDefinition) || {};
        const groupFields = definition.groupFields || {};
        const groupFieldsKeys = Object.keys(groupFields);

        groupFieldsKeys.forEach(key => {
            const fieldDefinition = groupFields[key];

            if (isInitializedFunction(record, key)) {
                return;
            }

            const groupViewField = {
                name: fieldDefinition.name,
                label: fieldDefinition.vname,
                type: fieldDefinition.type,
                fieldDefinition
            };

            const groupField = buildFieldFunction(record, groupViewField, language);
            addRecordFunction(record, fieldDefinition.name, groupField);
        });
    }

    /**
     * Create and add attributes fields to field
     *
     * @param {object} record Record
     * @param {object} fields FieldMap
     * @param {object} viewField ViewFieldDefinition
     * @param {object} language LanguageStore
     * @param {function} buildAttributeFunction
     * @param {function} addAttributeFunction
     */
    protected addAttributes(
        record: Record,
        fields: FieldMap,
        viewField: ViewFieldDefinition,
        language: LanguageStore,
        buildAttributeFunction: Function,
        addAttributeFunction: Function,
    ): void {
        const fieldKeys = Object.keys(fields) || [];


        if (fieldKeys.length < 1) {
            return;
        }

        fieldKeys.forEach(key => {
            const field = fields[key];
            this.addFieldAttributes(
                record,
                field,
                language,
                buildAttributeFunction,
                addAttributeFunction
            )
        });

    }

    /**
     * Create and add attributes fields to field
     *
     * @param {object} record Record
     * @param {object} field Field
     * @param {object} language LanguageStore
     * @param {function} buildAttributeFunction
     * @param {function} addAttributeFunction
     */
    protected addFieldAttributes(
        record: Record,
        field: Field,
        language: LanguageStore,
        buildAttributeFunction: Function,
        addAttributeFunction: Function
    ): void {

        const definition = (field && field.definition) || {};
        const attributes = definition.attributeFields || {};
        const attributeKeys = Object.keys(attributes);

        attributeKeys.forEach(key => {
            const attributeDefinition = attributes[key];

            if (!!field.attributes[key]) {
                return;
            }

            const attributeViewField = {
                name: attributeDefinition.name,
                label: attributeDefinition.vname,
                type: attributeDefinition.type,
                fieldDefinition: attributeDefinition
            };

            const attributeField = buildAttributeFunction(record, field, attributeViewField, language);
            addAttributeFunction(record, field, attributeDefinition.name, attributeField);
        });
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

    /**
     * Is criteria field initialized in record
     *
     * @param {object} record Record
     * @param {string} fieldName field
     * @returns {boolean} isInitialized
     */
    protected isCriteriaFieldInitialized(record: SavedFilter, fieldName: string): boolean {
        return !!record.criteriaFields[fieldName];
    }

    /**
     * Parse value from record
     *
     * @param {object} viewField ViewFieldDefinition
     * @param {object} definition FieldDefinition
     * @param {object} record Record
     * @returns {object} value object
     */
    protected parseValue(
        viewField: ViewFieldDefinition,
        definition: FieldDefinition,
        record: Record
    ): { value: string; valueList: string[]; valueObject?: any } {

        const type = (viewField && viewField.type) || '';
        const source = (definition && definition.source) || '';
        const rname = (definition && definition.rname) || 'name';
        const viewName = viewField.name || '';
        let value: string;
        let valueList: string[] = null;

        if (!viewName || !record.attributes[viewName]) {
            value = '';
        } else if (type === 'relate' && source === 'non-db' && rname !== '') {
            value = record.attributes[viewName][rname];
            const valueObject = record.attributes[viewName];
            return {value, valueList, valueObject};
        } else {
            value = record.attributes[viewName];
        }

        if (Array.isArray(value)) {
            valueList = value;
            value = null;
        }

        return {value, valueList};
    }


    /**
     * Parse attribute from field
     *
     * @param {object} viewField ViewFieldDefinition
     * @param {object} definition FieldDefinition
     * @param {object} record Record
     * @param {object} field Field
     * @returns {object} value object
     */
    protected parseAttributeValue(
        viewField: ViewFieldDefinition,
        definition: FieldDefinition,
        record: Record,
        field: Field
    ): { value: string; valueList: string[]; valueObject?: any } {

        const type = (viewField && viewField.type) || '';
        const source = (definition && definition.source) || '';
        const rname = (definition && definition.rname) || 'name';
        const viewName = viewField.name || '';
        let value: string;
        let valueList: string[] = null;

        if (!viewName || !field.attributes[viewName]) {
            value = '';
        } else if (type === 'relate' && source === 'non-db' && rname !== '') {
            value = this.getParentValue(field, viewName, definition)[rname];
            const valueObject = this.getParentValue(field, viewName, definition);
            return {value, valueList, valueObject};
        } else {
            value = this.getParentValue(field, viewName, definition);
        }

        if (Array.isArray(value)) {
            valueList = value;
            value = null;
        }

        return {value, valueList};
    }

    /**
     * Parse filter attribute from field
     *
     * @param {object} viewField ViewFieldDefinition
     * @param {object} definition FieldDefinition
     * @param {object} record Record
     * @param {object} field Field
     * @returns {object} value object
     */
    protected parseFilterAttributeValue(
        viewField: ViewFieldDefinition,
        definition: FieldDefinition,
        record: Record,
        field: Field
    ): { value: string; valueList: string[]; valueObject?: any } {

        const viewName = viewField.name || '';
        let value: any;

        if (!viewName) {
            value = '';
        } else {
            value = this.getParentValue(field, viewName, definition);
        }

        if (Array.isArray(value)) {
            return {
                value: null,
                valueList: value,
                valueObject: null
            }
        }

        if (isObjectLike(value)) {
            return {
                value: null,
                valueList: null,
                valueObject: value
            }
        }

        return {value, valueList: null, valueObject: null};
    }

    /**
     * Set attribute value on parent
     *
     * @param {object} field Field
     * @param {string} name String
     * @param {object} definition FieldDefinition
     * @returns any
     */
    protected getParentValue(field: Field, name: string, definition: FieldDefinition): any {
        if (definition.valuePath) {
            return get(field, definition.valuePath, '');
        }

        return get(field.valueObject, name, '');
    }

    /**
     * Get save validators for the given field definition
     *
     * @param {object} record Record
     * @param {object} viewField ViewFieldDefinition
     * @returns {object} Validator map
     */
    protected getSaveValidators(
        record: Record,
        viewField: ViewFieldDefinition
    ): { validators: ValidatorFn[]; asyncValidators: AsyncValidatorFn[] } {

        const validators = this.validationManager.getSaveValidations(record.module, viewField, record);
        const asyncValidators = this.validationManager.getAsyncSaveValidations(record.module, viewField, record);
        return {validators, asyncValidators};
    }

    /**
     * Get Filter Validators for given field definition
     *
     * @param {object} record  Record
     * @param {object} viewField ViewFieldDefinition
     * @returns {object} validator map
     */
    protected getFilterValidators(
        record: SavedFilter,
        viewField: ViewFieldDefinition
    ): { validators: ValidatorFn[]; asyncValidators: AsyncValidatorFn[] } {

        const validators = this.validationManager.getFilterValidations(record.searchModule, viewField, record);
        const asyncValidators: AsyncValidatorFn[] = [];

        return {validators, asyncValidators};
    }

    /**
     * Build and initialize field object
     *
     * @param {string} module to use
     * @param {object} viewField ViewFieldDefinition
     * @param {string} value string
     * @param {[]} valueList string[]
     * @param {} valueObject value object
     * @param {object} record Record
     * @param {object} definition FieldDefinition
     * @param {[]} validators ValidatorFn[]
     * @param {[]} asyncValidators AsyncValidatorFn[]
     * @param {object} language LanguageStore
     * @returns {object} BaseField
     */
    protected setupField(
        module: string,
        viewField: ViewFieldDefinition,
        value: string,
        valueList: string[],
        valueObject: any,
        record: Record,
        definition: FieldDefinition,
        validators: ValidatorFn[],
        asyncValidators: AsyncValidatorFn[],
        language: LanguageStore
    ): BaseField {

        const formattedValue = this.typeFormatter.toUserFormat(viewField.type, value, {mode: 'edit'});

        const metadata = viewField.metadata || {};

        if (viewField.link) {
            metadata.link = viewField.link;
        }

        const field = new BaseField();

        field.type = viewField.type;
        field.display = viewField.display || definition.display || 'default';
        field.defaultDisplay = field.display;
        field.value = value;
        field.metadata = metadata;
        field.definition = definition;
        field.labelKey = viewField.label || definition.vname || '';
        field.formControl = new FormControl(formattedValue, validators, asyncValidators);
        field.validators = validators;
        field.asyncValidators = asyncValidators;
        field.attributes = {};
        field.source = 'field';
        field.logic = viewField.logic || definition.logic || null;

        if (field.logic && Object.keys(field.logic).length) {
            const attributeDependencies: { [key: string]: AttributeDependency } = {};
            const fieldDependencies: StringMap = {};

            Object.keys(field.logic).forEach(logicKey => {
                const entry = field.logic[logicKey] || {} as FieldLogic;

                if (!entry.params) {
                    return;
                }

                if (entry.params && entry.params.attributeDependencies) {
                    entry.params.attributeDependencies.forEach(dependency => {
                        const dependencyKey = dependency.field + '.' + dependency.attribute;
                        attributeDependencies[dependencyKey] = dependency;
                    });

                }

                if (entry.params && entry.params.fieldDependencies) {
                    entry.params.fieldDependencies.forEach(dependency => {
                        fieldDependencies[dependency] = dependency;
                    });
                }

            });

            field.attributeDependencies = Object.keys(attributeDependencies).map(key => attributeDependencies[key]);
            field.fieldDependencies = Object.keys(fieldDependencies);
        }

        if (valueList) {
            field.valueList = valueList;
        }

        if (valueObject) {
            field.valueObject = valueObject;
        }

        if (language) {
            field.label = this.getFieldLabel(viewField.label, module, language);
        }

        if (viewField.label) {
            field.labelKey = viewField.label;
        }
        return field;
    }
}
