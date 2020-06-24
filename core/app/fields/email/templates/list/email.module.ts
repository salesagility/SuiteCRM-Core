import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {EmailListFieldsComponent} from './email.component';

@NgModule({
    declarations: [EmailListFieldsComponent],
    exports: [EmailListFieldsComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(EmailListFieldsComponent)
    ]
})
export class EmailListFieldsModule {
}
