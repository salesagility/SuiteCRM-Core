import {Field} from '@fields/field.model';
import {ButtonInterface} from '@components/button/button.model';

export interface FieldGridColumn {
    field?: Field;
    buttons?: ButtonInterface[];
    actionSlot?: boolean;
    specialSlot?: boolean;
}

export interface FieldGridRow {
    cols: FieldGridColumn[];
}
