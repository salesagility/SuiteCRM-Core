import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppManagerModule } from '../../../../src/app-manager/app-manager.module';
import { EmailbodyListFieldsComponent } from './emailbody.component';

@NgModule({
declarations: [EmailbodyListFieldsComponent],
exports: [EmailbodyListFieldsComponent],
imports: [
    CommonModule,
    AppManagerModule.forChild(EmailbodyListFieldsComponent)
]
})
export class EmailbodyListFieldsModule {}