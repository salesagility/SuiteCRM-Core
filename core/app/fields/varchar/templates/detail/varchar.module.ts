import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {VarcharDetailFieldComponent} from './varchar.component';
import {HtmlSanitizeModule} from '@base/pipes/html-sanitize/html-sanitize.module';

@NgModule({
    declarations: [VarcharDetailFieldComponent],
    exports: [VarcharDetailFieldComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(VarcharDetailFieldComponent),
        HtmlSanitizeModule
    ]
})
export class VarcharDetailFieldModule {
}
