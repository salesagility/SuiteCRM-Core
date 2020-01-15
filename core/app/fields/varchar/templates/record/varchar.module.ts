import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppManagerModule } from '../../../../src/app-manager/app-manager.module';
import { VarcharRecordFieldsComponent } from './varchar.component';

@NgModule({
declarations: [VarcharRecordFieldsComponent],
exports: [VarcharRecordFieldsComponent],
imports: [
    CommonModule,
    AppManagerModule.forChild(VarcharRecordFieldsComponent)
]
})
export class VarcharRecordFieldsModule {}