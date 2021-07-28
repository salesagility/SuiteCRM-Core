import {deepClone, Record, RecordMapper} from 'common';
import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class BaseSaveRecordMapper implements RecordMapper {

    getKey(): string {
        return 'base';
    }

    map(record: Record): void {

        if (!record.fields || !Object.keys(record.fields).length) {
            return;
        }

        Object.keys(record.fields).forEach(fieldName => {
            const field = record.fields[fieldName];

            const type = field.type || '';
            const source = field.definition.source || '';
            const rname = field.definition.rname || 'name';
            const idName = field.definition.id_name || '';

            if (type === 'relate' && source === 'non-db' && idName === fieldName) {
                record.attributes[fieldName] = field.value;
                return;
            }

            if (type === 'relate' && source === 'non-db' && rname !== '' && field.valueObject) {
                const attribute = record.attributes[fieldName] || {} as any;

                attribute[rname] = field.valueObject[rname];
                attribute.id = field.valueObject.id;

                record.attributes[fieldName] = attribute;
                record.attributes[idName] = field.valueObject.id;

                return;
            }

            if (field.valueObject) {
                record.attributes[fieldName] = field.valueObject;
                return;
            }

            if (field.items) {
                record.attributes[fieldName] = [];
                field.items.forEach(item => {
                    record.attributes[fieldName].push({
                        id: item.id,
                        module: item.module,
                        attributes: deepClone(item.attributes)
                    } as Record)
                });
                return;
            }

            if (field.valueObjectArray) {
                record.attributes[fieldName] = field.valueObjectArray;
                return;
            }

            if (field.valueList) {
                record.attributes[fieldName] = field.valueList;
                return;
            }

            record.attributes[fieldName] = field.value;
        });
    }
}
