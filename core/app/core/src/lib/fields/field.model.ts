import {Type} from '@angular/core';
import {BaseFieldComponent} from './base/base-field.component';

export interface FieldComponentMap {
    [key: string]: Type<BaseFieldComponent>
}
