import {VarcharDetailFieldModule} from '@fields/varchar/templates/detail/varchar.module';
import {VarcharDetailFieldComponent} from '@fields/varchar/templates/detail/varchar.component';
import {IntDetailFieldModule} from './int/templates/detail/int.module';
import {IntDetailFieldComponent} from './int/templates/detail/int.component';
import {FloatDetailFieldModule} from './float/templates/detail/float.module';
import {FloatDetailFieldComponent} from './float/templates/detail/float.component';

export const fieldModules = [
    VarcharDetailFieldModule,
    IntDetailFieldModule,
    FloatDetailFieldModule
];
export const fieldComponents = [
    VarcharDetailFieldComponent,
    IntDetailFieldComponent,
    FloatDetailFieldComponent
];

export const viewFieldsMap = {
    'varchar.list': VarcharDetailFieldComponent,
    'varchar.detail': VarcharDetailFieldComponent,
    'char.list': VarcharDetailFieldComponent,
    'char.detail': VarcharDetailFieldComponent,
    'int.list': IntDetailFieldComponent,
    'int.detail': IntDetailFieldComponent,
    'float.list': FloatDetailFieldComponent,
    'float.detail': FloatDetailFieldComponent
};
