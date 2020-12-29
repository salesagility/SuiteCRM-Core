import {FieldMap} from '@app-common/record/field.model';
import {FormGroup} from '@angular/forms';

export interface AttributeMap {
    [key: string]: any;
}

export interface Record {
    id?: string;
    type: string;
    module: string;
    attributes: AttributeMap;
    fields?: FieldMap;
    formGroup?: FormGroup;
}
