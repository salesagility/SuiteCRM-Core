import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {EnumDetailFieldComponent} from './enum.component';
import {FormsModule} from '@angular/forms';

@NgModule({
    declarations: [EnumDetailFieldComponent],
    exports: [EnumDetailFieldComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(EnumDetailFieldComponent),
        FormsModule
    ]
})
export class EnumDetailFieldModule {
}
