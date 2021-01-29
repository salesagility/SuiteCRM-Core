import {Injectable} from '@angular/core';
import {Record} from '@app-common/record/record.model';
import {FormGroup} from '@angular/forms';
import {ViewFieldDefinition} from '@app-common/metadata/metadata.model';
import {FieldMap} from '@app-common/record/field.model';
import {LanguageStore} from '@store/language/language.store';
import {FieldManager} from '@services/record/field/field.manager';

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
}
