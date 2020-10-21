import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {FormsModule} from '@angular/forms';
import {MultiEnumDetailFieldComponent} from '@fields/multienum/templates/detail/multienum.component';

@NgModule({
    declarations: [MultiEnumDetailFieldComponent],
    exports: [MultiEnumDetailFieldComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(MultiEnumDetailFieldComponent),
        FormsModule
    ]
})
export class MultiEnumDetailFieldModule {
}
