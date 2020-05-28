import {VarcharDetailFieldModule} from '@fields/varchar/templates/detail/varchar.module';
import {VarcharDetailFieldComponent} from '@fields/varchar/templates/detail/varchar.component';
import {IntDetailFieldModule} from '@fields/int/templates/detail/int.module';
import {IntDetailFieldComponent} from '@fields/int/templates/detail/int.component';
import {FloatDetailFieldModule} from '@fields/float/templates/detail/float.module';
import {FloatDetailFieldComponent} from '@fields/float/templates/detail/float.component';
import {PhoneDetailFieldModule} from '@fields/phone/templates/detail/phone.module';
import {PhoneDetailFieldComponent} from '@fields/phone/templates/detail/phone.component';

export const fieldModules = [
    VarcharDetailFieldModule,
    IntDetailFieldModule,
    FloatDetailFieldModule,
    PhoneDetailFieldModule
];
export const fieldComponents = [
    VarcharDetailFieldComponent,
    IntDetailFieldComponent,
    FloatDetailFieldComponent,
    PhoneDetailFieldComponent
];

export const viewFieldsMap = {
    'varchar.list': VarcharDetailFieldComponent,
    'varchar.detail': VarcharDetailFieldComponent,
    'char.list': VarcharDetailFieldComponent,
    'char.detail': VarcharDetailFieldComponent,
    'int.list': IntDetailFieldComponent,
    'int.detail': IntDetailFieldComponent,
    'float.list': FloatDetailFieldComponent,
    'float.detail': FloatDetailFieldComponent,
    'phone.list': PhoneDetailFieldComponent,
    'phone.detail': PhoneDetailFieldComponent
};
