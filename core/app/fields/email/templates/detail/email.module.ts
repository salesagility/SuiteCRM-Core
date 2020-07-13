import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {EmailDetailFieldsComponent} from './email.component';

@NgModule({
    declarations: [EmailDetailFieldsComponent],
    exports: [EmailDetailFieldsComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(EmailDetailFieldsComponent)
    ]
})
export class EmailDetailFieldsModule {
}
