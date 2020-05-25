import {VarcharListFieldsComponent} from './varchar/templates/list/varchar.component';
import {VarcharListFieldsModule} from './varchar/templates/list/varchar.module';
import {IntDetailFieldModule} from './int/templates/detail/int.module';
import {IntDetailFieldComponent} from './int/templates/detail/int.component';
import {FloatDetailFieldModule} from './float/templates/detail/float.module';
import {FloatDetailFieldComponent} from './float/templates/detail/float.component';

export const fieldModules = [
    VarcharListFieldsModule,
    IntDetailFieldModule,
    FloatDetailFieldModule
];
export const fieldComponents = [
    VarcharListFieldsComponent,
    IntDetailFieldComponent,
    FloatDetailFieldComponent
];

export const viewFieldsMap = {
    'varchar.list': VarcharListFieldsComponent,
    'varchar.record': VarcharListFieldsComponent,
    'char.list': VarcharListFieldsComponent,
    'char.record': VarcharListFieldsComponent,
    'int.list': IntDetailFieldComponent,
    'int.detail': IntDetailFieldComponent,
    'float.list': FloatDetailFieldComponent,
    'float.detail': FloatDetailFieldComponent
};
