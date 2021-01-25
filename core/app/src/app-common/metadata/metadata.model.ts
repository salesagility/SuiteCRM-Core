import {FieldDefinition, FieldMetadata} from '@app-common/record/field.model';

export interface ViewFieldDefinition {
    name?: string;
    label?: string;
    link?: boolean;
    type?: string;
    fieldDefinition?: FieldDefinition;
    metadata?: FieldMetadata;
}

export interface Panel {
    label?: string;
    key: string;
    rows: PanelRow[];
}

export interface PanelRow {
    cols: PanelCell[];
}

export interface PanelCell extends ViewFieldDefinition {
    name?: string;
}
