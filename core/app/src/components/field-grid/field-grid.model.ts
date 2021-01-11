import {ButtonInterface} from '@app-common/components/button/button.model';
import {Field} from '@app-common/record/field.model';

export interface FieldGridColumn {
    field?: Field;
    buttons?: ButtonInterface[];
    actionSlot?: boolean;
    specialSlot?: boolean;
}

export interface FieldGridRow {
    cols: FieldGridColumn[];
}
