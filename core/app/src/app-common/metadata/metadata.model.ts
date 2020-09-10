import {FieldDefinition} from '@app-common/record/field.model';

export interface ViewFieldDefinition {
    name?: string;
    label?: string;
    link?: boolean;
    type?: string;
    fieldDefinition?: FieldDefinition;
}
