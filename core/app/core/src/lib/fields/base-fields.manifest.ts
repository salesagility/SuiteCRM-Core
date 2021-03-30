/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2021 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */

import {PhoneDetailFieldComponent} from './phone/templates/detail/phone.component';
import {MultiEnumFilterFieldComponent} from './multienum/templates/filter/multienum.component';
import {EnumDetailFieldModule} from './enum/templates/detail/enum.module';
import {DynamicEnumDetailFieldModule} from './dynamicenum/templates/detail/dynamicenum.module';
import {FullNameDetailFieldsModule} from './fullname/templates/detail/fullname.module';
import {VarcharDetailFieldComponent} from './varchar/templates/detail/varchar.component';
import {UrlDetailFieldComponent} from './url/templates/detail/url.component';
import {DateTimeEditFieldModule} from './datetime/templates/edit/datetime.module';
import {DateDetailFieldModule} from './date/templates/detail/date.module';
import {CurrencyDetailFieldModule} from './currency/templates/detail/currency.module';
import {TextDetailFieldComponent} from './text/templates/detail/text.component';
import {VarcharEditFieldComponent} from './varchar/templates/edit/varchar.component';
import {DateTimeDetailFieldComponent} from './datetime/templates/detail/datetime.component';
import {DateTimeDetailFieldModule} from './datetime/templates/detail/datetime.module';
import {MultiEnumDetailFieldComponent} from './multienum/templates/detail/multienum.component';
import {EnumEditFieldComponent} from './enum/templates/edit/enum.component';
import {BooleanDetailFieldComponent} from './boolean/templates/detail/boolean.component';
import {EmailListFieldsModule} from './email/templates/list/email.module';
import {VarcharFilterFieldComponent} from './varchar/templates/filter/filter.component';
import {CurrencyDetailFieldComponent} from './currency/templates/detail/currency.component';
import {EnumEditFieldModule} from './enum/templates/edit/enum.module';
import {MultiEnumDetailFieldModule} from './multienum/templates/detail/multienum.module';
import {FloatDetailFieldModule} from './float/templates/detail/float.module';
import {DateDetailFieldComponent} from './date/templates/detail/date.component';
import {FloatDetailFieldComponent} from './float/templates/detail/float.component';
import {DateEditFieldComponent} from './date/templates/edit/date.component';
import {BooleanFilterFieldComponent} from './boolean/templates/filter/boolean.component';
import {EnumDetailFieldComponent} from './enum/templates/detail/enum.component';
import {VarcharFilterFieldModule} from './varchar/templates/filter/filter.module';
import {BooleanFilterFieldModule} from './boolean/templates/filter/boolean.module';
import {RelateDetailFieldComponent} from './relate/templates/detail/relate.component';
import {RelateEditFieldModule} from './relate/templates/edit/relate.module';
import {TextDetailFieldModule} from './text/templates/detail/text.module';
import {PhoneDetailFieldModule} from './phone/templates/detail/phone.module';
import {DynamicEnumDetailFieldComponent} from './dynamicenum/templates/detail/dynamicenum.component';
import {RelateEditFieldComponent} from './relate/templates/edit/relate.component';
import {DateEditFieldModule} from './date/templates/edit/date.module';
import {DynamicEnumEditFieldComponent} from './dynamicenum/templates/edit/dynamicenum.component';
import {MultiEnumFilterFieldModule} from './multienum/templates/filter/multienum.module';
import {RelateDetailFieldsModule} from './relate/templates/detail/relate.module';
import {BooleanEditFieldModule} from './boolean/templates/edit/boolean.module';
import {VarcharEditFieldModule} from './varchar/templates/edit/varchar.module';
import {EmailListFieldsComponent} from './email/templates/list/email.component';
import {DynamicEnumEditFieldModule} from './dynamicenum/templates/edit/dynamicenum.module';
import {BooleanDetailFieldModule} from './boolean/templates/detail/boolean.module';
import {UrlDetailFieldModule} from './url/templates/detail/url.module';
import {MultiEnumEditFieldComponent} from './multienum/templates/edit/multienum.component';
import {IntDetailFieldComponent} from './int/templates/detail/int.component';
import {MultiEnumEditFieldModule} from './multienum/templates/edit/multienum.module';
import {IntDetailFieldModule} from './int/templates/detail/int.module';
import {FullNameDetailFieldsComponent} from './fullname/templates/detail/fullname.component';
import {BooleanEditFieldComponent} from './boolean/templates/edit/boolean.component';
import {DateTimeEditFieldComponent} from './datetime/templates/edit/datetime.component';
import {VarcharDetailFieldModule} from './varchar/templates/detail/varchar.module';
import {FieldComponentMap} from './field.model';
import {TextEditFieldComponent} from './text/templates/edit/text.component';
import {DateFilterFieldModule} from './date/templates/filter/date.module';
import {DateFilterFieldComponent} from './date/templates/filter/date.component';
import {TextEditFieldModule} from './text/templates/edit/text.module';

export const baseFieldModules = [
    VarcharDetailFieldModule,
    VarcharEditFieldModule,
    VarcharFilterFieldModule,
    IntDetailFieldModule,
    FloatDetailFieldModule,
    PhoneDetailFieldModule,
    DateDetailFieldModule,
    DateEditFieldModule,
    DateFilterFieldModule,
    DateTimeDetailFieldModule,
    DateTimeEditFieldModule,
    UrlDetailFieldModule,
    CurrencyDetailFieldModule,
    EmailListFieldsModule,
    TextDetailFieldModule,
    TextEditFieldModule,
    RelateDetailFieldsModule,
    RelateEditFieldModule,
    FullNameDetailFieldsModule,
    EnumDetailFieldModule,
    EnumEditFieldModule,
    MultiEnumDetailFieldModule,
    MultiEnumEditFieldModule,
    MultiEnumFilterFieldModule,
    DynamicEnumDetailFieldModule,
    DynamicEnumEditFieldModule,
    BooleanDetailFieldModule,
    BooleanEditFieldModule,
    BooleanFilterFieldModule
];
export const baseFieldComponents = [
    VarcharDetailFieldComponent,
    VarcharEditFieldComponent,
    VarcharFilterFieldComponent,
    IntDetailFieldComponent,
    FloatDetailFieldComponent,
    PhoneDetailFieldComponent,
    DateDetailFieldComponent,
    DateEditFieldComponent,
    DateFilterFieldComponent,
    DateTimeDetailFieldComponent,
    DateTimeEditFieldComponent,
    UrlDetailFieldComponent,
    CurrencyDetailFieldComponent,
    EmailListFieldsComponent,
    TextDetailFieldComponent,
    TextEditFieldComponent,
    RelateDetailFieldComponent,
    RelateEditFieldComponent,
    FullNameDetailFieldsComponent,
    EnumDetailFieldComponent,
    EnumEditFieldComponent,
    MultiEnumDetailFieldComponent,
    MultiEnumEditFieldComponent,
    MultiEnumFilterFieldComponent,
    DynamicEnumDetailFieldComponent,
    DynamicEnumEditFieldComponent,
    BooleanDetailFieldComponent,
    BooleanEditFieldComponent,
    BooleanFilterFieldComponent
];

export const baseViewFieldsMap: FieldComponentMap = {
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
    'date.filter': DateFilterFieldComponent,
    'datetime.list': DateTimeDetailFieldComponent,
    'datetime.detail': DateTimeDetailFieldComponent,
    // 'datetime.edit': DateTimeEditFieldComponent, To enable when datetime component is fixed
    'url.list': UrlDetailFieldComponent,
    'url.detail': UrlDetailFieldComponent,
    'link.list': UrlDetailFieldComponent,
    'link.detail': UrlDetailFieldComponent,
    'currency.list': CurrencyDetailFieldComponent,
    'currency.detail': CurrencyDetailFieldComponent,
    'email.list': EmailListFieldsComponent,
    'email.detail': EmailListFieldsComponent,
    'text.detail': TextDetailFieldComponent,
    'text.edit': TextEditFieldComponent,
    'relate.detail': RelateDetailFieldComponent,
    'relate.list': RelateDetailFieldComponent,
    'relate.edit': RelateEditFieldComponent,
    'fullname.list': FullNameDetailFieldsComponent,
    'fullname.detail': FullNameDetailFieldsComponent,
    'enum.list': EnumDetailFieldComponent,
    'enum.detail': EnumDetailFieldComponent,
    'enum.edit': EnumEditFieldComponent,
    'enum.filter': MultiEnumFilterFieldComponent,
    'multienum.list': MultiEnumDetailFieldComponent,
    'multienum.detail': MultiEnumDetailFieldComponent,
    'multienum.edit': MultiEnumEditFieldComponent,
    'multienum.filter': MultiEnumFilterFieldComponent,
    'dynamicenum.list': DynamicEnumDetailFieldComponent,
    'dynamicenum.detail': DynamicEnumDetailFieldComponent,
    'dynamicenum.edit': DynamicEnumEditFieldComponent,
    'dynamicenum.filter': MultiEnumEditFieldComponent,
    'boolean.list': BooleanDetailFieldComponent,
    'boolean.detail': BooleanDetailFieldComponent,
    'boolean.edit': BooleanEditFieldComponent,
    'boolean.filter': BooleanFilterFieldComponent,
    'bool.list': BooleanDetailFieldComponent,
    'bool.detail': BooleanDetailFieldComponent,
    'bool.edit': BooleanEditFieldComponent,
    'bool.filter': BooleanFilterFieldComponent
};
