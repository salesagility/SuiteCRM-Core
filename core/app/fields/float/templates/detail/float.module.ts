import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {FloatDetailFieldComponent} from './float.component';
import {FormatNumberModule} from '@base/pipes/format-number/format-number.module';

@NgModule({
    declarations: [FloatDetailFieldComponent],
    exports: [FloatDetailFieldComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(FloatDetailFieldComponent),
        FormatNumberModule
    ]
})
export class FloatDetailFieldModule {
}
