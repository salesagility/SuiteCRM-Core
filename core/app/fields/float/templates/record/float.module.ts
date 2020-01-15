import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppManagerModule } from '../../../../src/app-manager/app-manager.module';
import { FloatRecordFieldsComponent } from './float.component';

@NgModule({
declarations: [FloatRecordFieldsComponent],
exports: [FloatRecordFieldsComponent],
imports: [
    CommonModule,
    AppManagerModule.forChild(FloatRecordFieldsComponent)
]
})
export class FloatRecordFieldsModule {}