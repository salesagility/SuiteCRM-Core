import {Record} from './record.model';
import {ViewFieldDefinition} from '@app-common/metadata/metadata.model';
import {SearchCriteriaFieldFilter} from '@app-common/views/list/search-criteria.model';
import {LanguageStore} from '@store/language/language.store';

export interface FieldDefinition {
    name?: string;
    type?: string; // label key to use
    vname?: string; // original label
    reportable?: boolean;
    required?: boolean;
    // eslint-disable-next-line camelcase
    duplicate_merge?: string;
    source?: string;
    id?: string;
    // eslint-disable-next-line camelcase
    id_name?: string;
    link?: string;
    module?: string;
    rname?: string;
    table?: string;
    readonly?: boolean;
    // eslint-disable-next-line camelcase
    inline_edit?: boolean;
}

export interface FieldMetadata {
    format?: boolean;
    target?: string;
    link?: boolean;
    rows?: number;
    cols?: number;
}

export interface FieldMap {
    [key: string]: Field;
}

export interface Field {
    type: string;
    value?: string;
    name?: string;
    label?: string;
    labelKey?: string;
    metadata?: FieldMetadata;
    definition?: FieldDefinition;
    criteria?: SearchCriteriaFieldFilter;
}

export class FieldManager {

    public static buildShallowField(type: string, value: string): Field {
        return {
            type,
            value,
            definition: {
                type
            }
        } as Field;
    }

    public static buildField(record: Record, viewField: ViewFieldDefinition, language: LanguageStore = null): Field {

        const definition = (viewField && viewField.fieldDefinition) || {} as FieldDefinition;
        const type = (viewField && viewField.type) || '';
        const source = (definition && definition.source) || '';
        const rname = (definition && definition.rname) || '';
        let value;

        if (type === 'relate' && source === 'non-db' && rname !== '') {
            value = record.attributes[viewField.name][rname];
        } else {
            value = record.attributes[viewField.name];
        }


        const field = {
            type: viewField.type,
            value,
            metadata: {
                link: viewField.link,
            },
            definition,
            labelKey: viewField.label,
        } as Field;

        if (language) {
            field.label = this.getFieldLabel(viewField.label, record.module, language);
        }

        return field;
    }

    public static getFieldLabel(label: string, module: string, language: LanguageStore): string {
        const languages = language.getLanguageStrings();
        return language.getFieldLabel(label, module, languages);
    }
}
