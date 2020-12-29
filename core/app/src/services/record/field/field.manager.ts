import {Record} from '@app-common/record/record.model';
import {ViewFieldDefinition} from '@app-common/metadata/metadata.model';
import {LanguageStore} from '@store/language/language.store';
import {FormControl} from '@angular/forms';
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
        const type = (viewField && viewField.type) || '';
        const source = (definition && definition.source) || '';
        const rname = (definition && definition.rname) || 'name';
        const viewName = viewField.name || '';
        let value;
        let valueList = null;

        if (!viewName) {
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

        const validators = this.validationManager.getValidations(record.module, viewField, record);
        const asyncValidators = this.validationManager.getAsyncValidations(record.module, viewField, record);

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

    public getFieldLabel(label: string, module: string, language: LanguageStore): string {
        const languages = language.getLanguageStrings();
        return language.getFieldLabel(label, module, languages);
    }
}
