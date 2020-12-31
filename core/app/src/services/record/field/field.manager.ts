import {Record} from '@app-common/record/record.model';
import {ViewFieldDefinition} from '@app-common/metadata/metadata.model';
import {LanguageStore} from '@store/language/language.store';
import {AsyncValidatorFn, FormControl, ValidatorFn} from '@angular/forms';
import {Field, FieldDefinition} from '@app-common/record/field.model';
import {Injectable} from '@angular/core';
import {ValidationManager} from '@services/record/validation/validation.manager';
import {DataTypeFormatter} from '@services/formatters/data-type.formatter.service';

@Injectable({
    providedIn: 'root'
})
export class FieldManager {

    constructor(protected validationManager: ValidationManager, protected typeFormatter: DataTypeFormatter) {
    }

    public buildShallowField(type: string, value: string): Field {
        return {
            type,
            value,
            definition: {
                type
            }
        } as Field;
    }

    public buildField(record: Record, viewField: ViewFieldDefinition, language: LanguageStore = null): Field {

        const definition = (viewField && viewField.fieldDefinition) || {} as FieldDefinition;
        const {value, valueList} = this.parseValue(viewField, definition, record);
        const {validators, asyncValidators} = this.getValidators(record, viewField);

        return this.setupField(viewField, value, valueList, record, definition, validators, asyncValidators, language);
    }

    public buildFilterField(record: Record, viewField: ViewFieldDefinition, language: LanguageStore = null): Field {

        const definition = (viewField && viewField.fieldDefinition) || {} as FieldDefinition;
        const {value, valueList} = this.parseValue(viewField, definition, record);
        const {validators, asyncValidators} = this.getFilterValidators(record, viewField);

        return this.setupField(viewField, value, valueList, record, definition, validators, asyncValidators, language);
    }

    public getFieldLabel(label: string, module: string, language: LanguageStore): string {
        const languages = language.getLanguageStrings();
        return language.getFieldLabel(label, module, languages);
    }

    protected parseValue(
        viewField: ViewFieldDefinition,
        definition: FieldDefinition,
        record: Record
    ): { value: string; valueList: string[] } {

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
        } else {
            value = record.attributes[viewName];
        }

        if (Array.isArray(value)) {
            valueList = value;
            value = null;
        }

        return {value, valueList};
    }

    protected getValidators(
        record: Record,
        viewField: ViewFieldDefinition
    ): { validators: ValidatorFn[]; asyncValidators: AsyncValidatorFn[] } {

        const validators = this.validationManager.getSaveValidations(record.module, viewField, record);
        const asyncValidators = this.validationManager.getAsyncSaveValidations(record.module, viewField, record);
        return {validators, asyncValidators};
    }

    protected getFilterValidators(
        record: Record,
        viewField: ViewFieldDefinition
    ): { validators: ValidatorFn[]; asyncValidators: AsyncValidatorFn[] } {

        const validators = this.validationManager.getFilterValidations(record.module, viewField, record);
        const asyncValidators: AsyncValidatorFn[] = [];

        return {validators, asyncValidators};
    }

    protected setupField(
        viewField: ViewFieldDefinition,
        value: string,
        valueList: string[],
        record: Record,
        definition: FieldDefinition,
        validators: ValidatorFn[],
        asyncValidators: AsyncValidatorFn[],
        language: LanguageStore
    ): Field {

        const formattedValue = this.typeFormatter.toUserFormat(viewField.type, value, {mode: 'edit'});

        const field = {
            type: viewField.type,
            value,
            metadata: {
                link: viewField.link,
            },
            definition,
            labelKey: viewField.label,
            formControl: new FormControl(formattedValue, validators, asyncValidators),
            validators,
            asyncValidators
        } as Field;

        if (valueList) {
            field.valueList = valueList;
        }

        if (language) {
            field.label = this.getFieldLabel(viewField.label, record.module, language);
        }
        return field;
    }
}
