import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppManagerModule } from '../../../../src/app-manager/app-manager.module';
import { BooleanRecordFieldsComponent } from './boolean.component';

@NgModule({
declarations: [BooleanRecordFieldsComponent],
exports: [BooleanRecordFieldsComponent],
imports: [
    CommonModule,
    AppManagerModule.forChild(BooleanRecordFieldsComponent)
]
})
export class BooleanRecordFieldsModule {}