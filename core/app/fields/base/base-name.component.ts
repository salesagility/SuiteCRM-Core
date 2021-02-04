import {BaseFieldComponent} from './base-field.component';
import {Field} from '@app-common/record/field.model';
import {Record} from '@app-common/record/record.model';
import {DataTypeFormatter} from '@services/formatters/data-type.formatter.service';
import {Component} from '@angular/core';

@Component({template: ''})
export class BaseNameComponent extends BaseFieldComponent {

    constructor(protected typeFormatter: DataTypeFormatter) {
        super(typeFormatter);
    }

    getNameField(field: Field, record: Record): string {
        if (!field.value || !record.attributes) {
            return;
        }

        const format = field.value.split(' ');
        const groupField = [];

        format.forEach(item => {
            if (record.attributes[item]) {
                groupField.push(record.attributes[item]);
            }
        });

        return groupField.join(' ');
    }
}
