import {FieldMap} from '@app-common/record/field.model';

export interface AttributeMap {
    [key: string]: any;
}

export interface Record {
    id?: string;
    type: string;
    module: string;
    attributes: AttributeMap;
    fields?: FieldMap;
}
