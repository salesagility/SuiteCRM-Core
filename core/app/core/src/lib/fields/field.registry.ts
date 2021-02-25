import {Injectable, Type} from '@angular/core';
import {OverridableMap} from 'common';
import {BaseFieldComponent} from './base/base-field.component';
import {viewFieldsMap} from './field.manifest';
import {FieldComponentMap} from './field.model';
import {BaseFieldRegistry} from './base-field.registry';

@Injectable({
    providedIn: 'root'
})
export class FieldRegistry extends BaseFieldRegistry {
    protected map: OverridableMap<Type<BaseFieldComponent>>;

    constructor() {
        super();
    }

    protected getDefaultMap(): FieldComponentMap {
        return viewFieldsMap;
    }
}
