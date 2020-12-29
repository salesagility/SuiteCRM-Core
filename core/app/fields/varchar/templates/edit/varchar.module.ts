import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {VarcharEditFieldComponent} from './varchar.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LabelModule} from '@components/label/label.module';

@NgModule({
    declarations: [VarcharEditFieldComponent],
    exports: [VarcharEditFieldComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(VarcharEditFieldComponent),
        FormsModule,
        ReactiveFormsModule,
        LabelModule
    ]
})
export class VarcharEditFieldModule {
}
