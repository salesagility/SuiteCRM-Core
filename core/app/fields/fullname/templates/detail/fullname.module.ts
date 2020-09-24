import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {FullNameDetailFieldsComponent} from './fullname.component';

@NgModule({
    declarations: [FullNameDetailFieldsComponent],
    exports: [FullNameDetailFieldsComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(FullNameDetailFieldsComponent)
    ]
})
export class FullNameDetailFieldsModule {
}
