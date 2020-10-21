import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {FormsModule} from '@angular/forms';
import {TagInputModule} from 'ngx-chips';
import {MultiEnumEditFieldComponent} from '@fields/multienum/templates/edit/multienum.component';

@NgModule({
    declarations: [MultiEnumEditFieldComponent],
    exports: [MultiEnumEditFieldComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(MultiEnumEditFieldComponent),
        TagInputModule,
        FormsModule
    ]
})
export class MultiEnumEditFieldModule {
}
