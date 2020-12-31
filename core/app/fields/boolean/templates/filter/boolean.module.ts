import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {BooleanFilterFieldComponent} from './boolean.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TagInputModule} from 'ngx-chips';

@NgModule({
    declarations: [BooleanFilterFieldComponent],
    exports: [BooleanFilterFieldComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(BooleanFilterFieldComponent),
        FormsModule,
        ReactiveFormsModule,
        TagInputModule
    ]
})
export class BooleanFilterFieldModule {
}
