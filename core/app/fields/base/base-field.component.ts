import {Input} from '@angular/core';
import {FieldComponentInterface} from './field.interface';
import {Field} from '@app-common/record/field.model';

export class BaseFieldComponent implements FieldComponentInterface {
    @Input() field: Field;
    @Input() klass: { [klass: string]: any } = null;

    constructor() {
    }
}
