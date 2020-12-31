import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {MultiEnumFilterFieldComponent} from './multienum.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TagInputModule} from 'ngx-chips';

@NgModule({
    declarations: [MultiEnumFilterFieldComponent],
    exports: [MultiEnumFilterFieldComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(MultiEnumFilterFieldComponent),
        FormsModule,
        ReactiveFormsModule,
        TagInputModule
    ]
})
export class MultiEnumFilterFieldModule {
}
