import {VarcharListFieldsComponent} from './varchar/templates/list/varchar.component';
import {VarcharListFieldsModule} from './varchar/templates/list/varchar.module';

export const fieldModules = [
    VarcharListFieldsModule
];
export const fieldComponents = [
    VarcharListFieldsComponent
];

export const viewFieldsMap = {
    'varchar.list': VarcharListFieldsComponent,
    'varchar.record': VarcharListFieldsComponent,
    'char.list': VarcharListFieldsComponent,
    'char.record': VarcharListFieldsComponent
};
