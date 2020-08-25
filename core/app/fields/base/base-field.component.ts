import {Input} from '@angular/core';
import {Field} from '../field.model';
import {FieldComponentInterface} from './field.interface';

export class BaseFieldComponent implements FieldComponentInterface {
    @Input() field: Field;
    @Input() klass: { [klass: string]: any } = null;

    constructor() {
    }
}
