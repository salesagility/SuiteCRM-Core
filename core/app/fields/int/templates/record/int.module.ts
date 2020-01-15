import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppManagerModule } from '../../../../src/app-manager/app-manager.module';
import { IntRecordFieldsComponent } from './int.component';

@NgModule({
declarations: [IntRecordFieldsComponent],
exports: [IntRecordFieldsComponent],
imports: [
    CommonModule,
    AppManagerModule.forChild(IntRecordFieldsComponent)
]
})
export class IntRecordFieldsModule {}