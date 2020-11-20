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
import {RelateDetailFieldsModule} from '@fields/relate/templates/detail/relate.module';
import {RelateDetailFieldsComponent} from '@fields/relate/templates/detail/relate.component';
import {FullNameDetailFieldsComponent} from '@fields/fullname/templates/detail/fullname.component';
import {FullNameDetailFieldsModule} from '@fields/fullname/templates/detail/fullname.module';
import {DateEditFieldComponent} from '@fields/date/templates/edit/date.component';
import {DateTimeEditFieldComponent} from '@fields/datetime/templates/edit/datetime.component';
import {DateEditFieldModule} from '@fields/date/templates/edit/date.module';
import {DateTimeEditFieldModule} from '@fields/datetime/templates/edit/datetime.module';
import {EnumDetailFieldComponent} from '@fields/enum/templates/detail/enum.component';
import {EnumDetailFieldModule} from '@fields/enum/templates/detail/enum.module';
import {EnumEditFieldComponent} from '@fields/enum/templates/edit/enum.component';
import {EnumEditFieldModule} from '@fields/enum/templates/edit/enum.module';
import {MultiEnumDetailFieldModule} from '@fields/multienum/templates/detail/multienum.module';
import {MultiEnumEditFieldModule} from '@fields/multienum/templates/edit/multienum.module';
import {MultiEnumDetailFieldComponent} from '@fields/multienum/templates/detail/multienum.component';
import {MultiEnumEditFieldComponent} from '@fields/multienum/templates/edit/multienum.component';
import {BooleanDetailFieldModule} from '@fields/boolean/templates/detail/boolean.module';
import {BooleanEditFieldModule} from '@fields/boolean/templates/edit/boolean.module';
import {BooleanDetailFieldComponent} from '@fields/boolean/templates/detail/boolean.component';
import {BooleanEditFieldComponent} from '@fields/boolean/templates/edit/boolean.component';

export const fieldModules = [
    VarcharDetailFieldModule,
    VarcharEditFieldModule,
    VarcharFilterFieldModule,
    IntDetailFieldModule,
    FloatDetailFieldModule,
    PhoneDetailFieldModule,
    DateDetailFieldModule,
    DateEditFieldModule,
    DateTimeDetailFieldModule,
    DateTimeEditFieldModule,
    UrlDetailFieldModule,
    CurrencyDetailFieldModule,
    EmailListFieldsModule,
    TextDetailFieldModule,
    RelateDetailFieldsModule,
    FullNameDetailFieldsModule,
    EnumDetailFieldModule,
    EnumEditFieldModule,
    MultiEnumDetailFieldModule,
    MultiEnumEditFieldModule,
    BooleanDetailFieldModule,
    BooleanEditFieldModule
];
export const fieldComponents = [
    VarcharDetailFieldComponent,
    VarcharEditFieldComponent,
    VarcharFilterFieldComponent,
    IntDetailFieldComponent,
    FloatDetailFieldComponent,
    PhoneDetailFieldComponent,
    DateDetailFieldComponent,
    DateEditFieldComponent,
    DateTimeDetailFieldComponent,
    DateTimeEditFieldComponent,
    UrlDetailFieldComponent,
    CurrencyDetailFieldComponent,
    EmailListFieldsComponent,
    TextDetailFieldComponent,
    RelateDetailFieldsComponent,
    FullNameDetailFieldsComponent,
    EnumDetailFieldComponent,
    EnumEditFieldComponent,
    MultiEnumDetailFieldComponent,
    MultiEnumEditFieldComponent,
    BooleanDetailFieldComponent,
    BooleanEditFieldComponent
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
    'date.edit': DateEditFieldComponent,
    'datetime.list': DateTimeDetailFieldComponent,
    'datetime.detail': DateTimeDetailFieldComponent,
    'datetime.edit': DateTimeEditFieldComponent,
    'url.list': UrlDetailFieldComponent,
    'url.detail': UrlDetailFieldComponent,
    'link.list': UrlDetailFieldComponent,
    'link.detail': UrlDetailFieldComponent,
    'currency.list': CurrencyDetailFieldComponent,
    'currency.detail': CurrencyDetailFieldComponent,
    'email.list': EmailListFieldsComponent,
    'email.detail': EmailListFieldsComponent,
    'text.detail': TextDetailFieldComponent,
    'relate.detail': RelateDetailFieldsComponent,
    'relate.list': RelateDetailFieldsComponent,
    'fullname.list': FullNameDetailFieldsComponent,
    'fullname.detail': FullNameDetailFieldsComponent,
    'enum.list': EnumDetailFieldComponent,
    'enum.detail': EnumDetailFieldComponent,
    'enum.edit': EnumEditFieldComponent,
    'multienum.list': MultiEnumDetailFieldComponent,
    'multienum.detail': MultiEnumDetailFieldComponent,
    'multienum.edit': MultiEnumEditFieldComponent,
    'boolean.list': BooleanDetailFieldComponent,
    'boolean.detail': BooleanDetailFieldComponent,
    'boolean.edit': BooleanEditFieldComponent,
    'bool.list': BooleanDetailFieldComponent,
    'bool.detail': BooleanDetailFieldComponent,
    'bool.edit': BooleanEditFieldComponent
};
