import {Input} from '@angular/core';
import {FieldComponentInterface} from './field.interface';
import {Field} from '@app-common/record/field.model';
import {Record} from '@app-common/record/record.model';

export class BaseFieldComponent implements FieldComponentInterface {
    @Input() field: Field;
    @Input() record: Record;
    @Input() klass: { [klass: string]: any } = null;

    constructor() {
    }
}
