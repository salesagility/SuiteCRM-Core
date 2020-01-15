import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppManagerModule } from '../../../../src/app-manager/app-manager.module';
import { PasswordRecordFieldsComponent } from './password.component';

@NgModule({
declarations: [PasswordRecordFieldsComponent],
exports: [PasswordRecordFieldsComponent],
imports: [
    CommonModule,
    AppManagerModule.forChild(PasswordRecordFieldsComponent)
]
})
export class PasswordRecordFieldsModule {}