import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {TextEditFieldComponent} from './text.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
    declarations: [TextEditFieldComponent],
    exports: [TextEditFieldComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(TextEditFieldComponent),
        FormsModule,
        ReactiveFormsModule
    ]
})
export class TextEditFieldModule {
}
