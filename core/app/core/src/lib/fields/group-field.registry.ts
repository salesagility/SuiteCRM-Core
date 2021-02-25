import {Injectable} from '@angular/core';
import {baseViewFieldsMap} from './base-fields.manifest';
import {FieldComponentMap} from './field.model';
import {BaseFieldRegistry} from './base-field.registry';

@Injectable({
    providedIn: 'root'
})
export class GroupFieldRegistry extends BaseFieldRegistry {

    constructor() {
        super();
    }

    protected getDefaultMap(): FieldComponentMap {
        return baseViewFieldsMap;
    }
}
