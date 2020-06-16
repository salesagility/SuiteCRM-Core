import {Input} from '@angular/core';
import {Field} from '../field.model';
import {FieldComponentInterface} from './field.interface';

export class BaseFieldComponent implements FieldComponentInterface {
    @Input() field: Field;

    constructor() {
    }
}
