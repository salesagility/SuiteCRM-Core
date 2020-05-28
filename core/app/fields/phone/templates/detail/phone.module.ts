import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {PhoneDetailFieldComponent} from './phone.component';

@NgModule({
    declarations: [PhoneDetailFieldComponent],
    exports: [PhoneDetailFieldComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(PhoneDetailFieldComponent)
    ]
})
export class PhoneDetailFieldModule {
}
