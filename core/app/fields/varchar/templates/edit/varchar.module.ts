import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {VarcharEditFieldComponent} from './varchar.component';
import {FormsModule} from '@angular/forms';

@NgModule({
    declarations: [VarcharEditFieldComponent],
    exports: [VarcharEditFieldComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(VarcharEditFieldComponent),
        FormsModule
    ]
})
export class VarcharEditFieldModule {
}
