import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppManagerModule } from '../../../../src/app-manager/app-manager.module';
import { EnumRecordFieldsComponent } from './enum.component';

@NgModule({
declarations: [EnumRecordFieldsComponent],
exports: [EnumRecordFieldsComponent],
imports: [
    CommonModule,
    AppManagerModule.forChild(EnumRecordFieldsComponent)
]
})
export class EnumRecordFieldsModule {}