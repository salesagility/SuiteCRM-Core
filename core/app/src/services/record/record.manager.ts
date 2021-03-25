import {Injectable} from '@angular/core';
import {Record} from '@app-common/record/record.model';
import {FormGroup} from '@angular/forms';
import {ViewFieldDefinition} from '@app-common/metadata/metadata.model';
import {FieldDefinitionMap, FieldMap} from '@app-common/record/field.model';
import {LanguageStore} from '@store/language/language.store';
import {FieldManager} from '@services/record/field/field.manager';
import {Params} from '@angular/router';
import {isVoid} from '@app-common/utils/value-utils';

@Injectable({
    providedIn: 'root'
})
export class RecordManager {

    constructor(
        protected fieldManager: FieldManager,
        protected language: LanguageStore
    ) {
    }

    /**
     * Get empty record
     *
     * @param {string} module string
     * @returns {object} Record
     */
    buildEmptyRecord(module: string): Record {
        return {
            module,
            attributes: {},
            fields: {},
            formGroup: new FormGroup({}),
        } as Record;
    }

    /**
     * Init Fields
     *
     * @param {object} record to use
     * @param {object} viewFieldDefinitions to use
     * @returns {object} fields
     */
    public initFields(record: Record, viewFieldDefinitions: ViewFieldDefinition[]): FieldMap {

        if (!record.fields) {
            record.fields = {} as FieldMap;
        }

        if (!record.formGroup) {
            record.formGroup = new FormGroup({});
        }

        viewFieldDefinitions.forEach(viewField => {
            if (!viewField || !viewField.name) {
                return;
            }
            this.fieldManager.addField(record, viewField, this.language);
        });

        return record.fields;
    }

    /**
     * Inject param fields
     *
     * @param {object} params Params
     * @param {object} record Record
     * @param {object} vardefs FieldDefinitionMap
     */
    public injectParamFields(params: Params, record: Record, vardefs: FieldDefinitionMap): void {

        Object.keys(params).forEach(paramKey => {

            const definition = vardefs[paramKey];

            if (!isVoid(definition)) {
                const type = definition.type || '';
                const idName = definition.id_name || '';
                const name = definition.name || '';
                const rname = definition.rname || '';

                if (type === 'relate' && idName === name) {
                    record.attributes[paramKey] = params[paramKey];
                    return;
                }

                if (type === 'relate') {
                    const relate = {} as any;

                    if (rname) {
                        relate[rname] = params[paramKey];
                    }

                    if (idName && params[idName]) {
                        relate.id = params[idName];
                    }

                    record.attributes[paramKey] = relate;

                    return;
                }

                record.attributes[paramKey] = params[paramKey];

                return;
            }

        });
    }
}
