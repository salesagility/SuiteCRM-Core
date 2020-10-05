import {FieldDefinition} from '@app-common/record/field.model';

export interface ViewFieldDefinition {
    name?: string;
    label?: string;
    translatedLabel?: string;
    link?: boolean;
    type?: string;
    fieldDefinition?: FieldDefinition;
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
