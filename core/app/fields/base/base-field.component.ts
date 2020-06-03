import {Input, Directive} from '@angular/core';
import {Field} from '../field.model';
import {FieldComponentInterface} from './field.interface';

@Directive()
export class BaseFieldComponent implements FieldComponentInterface {
    @Input() field: Field;
    @Input() klass: { [klass: string]: any } = null;

    constructor() {
    }
}
