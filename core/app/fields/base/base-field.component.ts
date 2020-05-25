import {Input} from '@angular/core';
import {FieldMetadata} from '../field.model';
import {FieldComponentInterface} from './field.interface';

export class BaseFieldComponent implements FieldComponentInterface {
    @Input() type: string;
    @Input() value: string;
    @Input() metadata: FieldMetadata;

    constructor() {
    }
}
