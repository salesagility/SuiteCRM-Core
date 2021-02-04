import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BaseBooleanComponent} from '@fields/base/base-boolean.component';
import {BaseEnumComponent} from '@fields/base/base-enum.component';
import {BaseFieldComponent} from '@fields/base/base-field.component';
import {BaseMultiEnumComponent} from '@fields/base/base-multienum.component';
import {BaseNameComponent} from '@fields/base/base-name.component';
import {BaseNumberComponent} from '@fields/base/base-number.component';
import {BaseRelateComponent} from '@fields/base/base-relate.component';
import {BaseDateTimeComponent} from '@fields/base/datetime/base-datetime.component';

@NgModule({
    exports: [
        BaseBooleanComponent,
        BaseEnumComponent,
        BaseFieldComponent,
        BaseMultiEnumComponent,
        BaseNameComponent,
        BaseNumberComponent,
        BaseRelateComponent,
        BaseDateTimeComponent
    ],
    declarations: [
        BaseBooleanComponent,
        BaseEnumComponent,
        BaseFieldComponent,
        BaseMultiEnumComponent,
        BaseNameComponent,
        BaseNumberComponent,
        BaseRelateComponent,
        BaseDateTimeComponent
    ],
    imports: [
        CommonModule
    ]
})
export class BaseFieldModule {
}
