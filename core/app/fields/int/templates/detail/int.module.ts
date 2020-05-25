import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {IntDetailFieldComponent} from './int.component';
import {FormatNumberModule} from '@base/pipes/format-number/format-number.module';

@NgModule({
    declarations: [IntDetailFieldComponent],
    exports: [IntDetailFieldComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(IntDetailFieldComponent),
        FormatNumberModule
    ]
})
export class IntDetailFieldModule {
}
