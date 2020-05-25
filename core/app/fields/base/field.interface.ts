import {FieldMetadata} from '../field.model';

export interface FieldComponentInterface {
    type: string;
    value: string;
    metadata?: FieldMetadata;
}