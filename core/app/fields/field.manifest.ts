import {VarcharDetailFieldModule} from '@fields/varchar/templates/detail/varchar.module';
import {VarcharDetailFieldComponent} from '@fields/varchar/templates/detail/varchar.component';
import {VarcharEditFieldModule} from '@fields/varchar/templates/edit/varchar.module';
import {VarcharEditFieldComponent} from '@fields/varchar/templates/edit/varchar.component';
import {VarcharFilterFieldModule} from '@fields/varchar/templates/filter/filter.module';
import {VarcharFilterFieldComponent} from '@fields/varchar/templates/filter/filter.component';
import {IntDetailFieldModule} from '@fields/int/templates/detail/int.module';
import {IntDetailFieldComponent} from '@fields/int/templates/detail/int.component';
import {FloatDetailFieldModule} from '@fields/float/templates/detail/float.module';
import {FloatDetailFieldComponent} from '@fields/float/templates/detail/float.component';
import {PhoneDetailFieldModule} from '@fields/phone/templates/detail/phone.module';
import {PhoneDetailFieldComponent} from '@fields/phone/templates/detail/phone.component';
import {DateDetailFieldModule} from '@fields/date/templates/detail/date.module';
import {DateTimeDetailFieldModule} from '@fields/datetime/templates/detail/datetime.module';
import {DateDetailFieldComponent} from '@fields/date/templates/detail/date.component';
import {DateTimeDetailFieldComponent} from '@fields/datetime/templates/detail/datetime.component';
import {UrlDetailFieldModule} from '@fields/url/templates/detail/url.module';
import {UrlDetailFieldComponent} from '@fields/url/templates/detail/url.component';
import {CurrencyDetailFieldModule} from '@fields/currency/templates/detail/currency.module';
import {CurrencyDetailFieldComponent} from '@fields/currency/templates/detail/currency.component';
import {EmailListFieldsModule} from '@fields/email/templates/list/email.module';
import {EmailListFieldsComponent} from '@fields/email/templates/list/email.component';
import {TextDetailFieldComponent} from '@fields/text/templates/detail/text.component';
import {TextDetailFieldModule} from '@fields/text/templates/detail/text.module';

export const fieldModules = [
    VarcharDetailFieldModule,
    VarcharEditFieldModule,
    VarcharFilterFieldModule,
    IntDetailFieldModule,
    FloatDetailFieldModule,
    PhoneDetailFieldModule,
    DateDetailFieldModule,
    DateTimeDetailFieldModule,
    UrlDetailFieldModule,
    CurrencyDetailFieldModule,
    EmailListFieldsModule,
    TextDetailFieldModule
];
export const fieldComponents = [
    VarcharDetailFieldComponent,
    VarcharEditFieldComponent,
    VarcharFilterFieldComponent,
    IntDetailFieldComponent,
    FloatDetailFieldComponent,
    PhoneDetailFieldComponent,
    DateDetailFieldComponent,
    DateTimeDetailFieldComponent,
    UrlDetailFieldComponent,
    CurrencyDetailFieldComponent,
    EmailListFieldsComponent,
    TextDetailFieldComponent
];

export const viewFieldsMap = {
    'varchar.list': VarcharDetailFieldComponent,
    'varchar.detail': VarcharDetailFieldComponent,
    'varchar.edit': VarcharEditFieldComponent,
    'varchar.filter': VarcharFilterFieldComponent,
    'char.list': VarcharDetailFieldComponent,
    'char.detail': VarcharDetailFieldComponent,
    'int.list': IntDetailFieldComponent,
    'int.detail': IntDetailFieldComponent,
    'float.list': FloatDetailFieldComponent,
    'float.detail': FloatDetailFieldComponent,
    'phone.list': PhoneDetailFieldComponent,
    'phone.detail': PhoneDetailFieldComponent,
    'date.list': DateDetailFieldComponent,
    'date.detail': DateDetailFieldComponent,
    'datetime.list': DateTimeDetailFieldComponent,
    'datetime.detail': DateTimeDetailFieldComponent,
    'url.list': UrlDetailFieldComponent,
    'url.detail': UrlDetailFieldComponent,
    'currency.list': CurrencyDetailFieldComponent,
    'currency.detail': CurrencyDetailFieldComponent,
    'email.list': EmailListFieldsComponent,
    'email.detail': EmailListFieldsComponent,
    'text.detail': TextDetailFieldComponent
};
