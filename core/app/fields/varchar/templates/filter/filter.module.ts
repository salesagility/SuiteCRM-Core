import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {VarcharFilterFieldComponent} from './filter.component';
import {FormsModule} from '@angular/forms';

@NgModule({
    declarations: [VarcharFilterFieldComponent],
    exports: [VarcharFilterFieldComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(VarcharFilterFieldComponent),
        FormsModule
    ]
})
export class VarcharFilterFieldModule {
}
