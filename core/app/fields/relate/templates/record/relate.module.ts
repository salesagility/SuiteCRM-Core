import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppManagerModule } from '../../../../src/app-manager/app-manager.module';
import { RelateRecordFieldsComponent } from './relate.component';

@NgModule({
declarations: [RelateRecordFieldsComponent],
exports: [RelateRecordFieldsComponent],
imports: [
    CommonModule,
    AppManagerModule.forChild(RelateRecordFieldsComponent)
]
})
export class RelateRecordFieldsModule {}