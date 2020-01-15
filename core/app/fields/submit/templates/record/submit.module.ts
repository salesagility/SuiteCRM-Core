import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppManagerModule } from '../../../../src/app-manager/app-manager.module';
import { SubmitRecordFieldsComponent } from './submit.component';

@NgModule({
declarations: [SubmitRecordFieldsComponent],
exports: [SubmitRecordFieldsComponent],
imports: [
    CommonModule,
    AppManagerModule.forChild(SubmitRecordFieldsComponent)
]
})
export class SubmitRecordFieldsModule {}