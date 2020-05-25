import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {VarcharDetailFieldComponent} from './varchar.component';

@NgModule({
    declarations: [VarcharDetailFieldComponent],
    exports: [VarcharDetailFieldComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(VarcharDetailFieldComponent)
    ]
})
export class VarcharDetailFieldModule {
}
