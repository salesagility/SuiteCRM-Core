import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppManagerModule } from '../../../../src/app-manager/app-manager.module';
import { MultienumRecordFieldsComponent } from './multienum.component';

@NgModule({
declarations: [MultienumRecordFieldsComponent],
exports: [MultienumRecordFieldsComponent],
imports: [
    CommonModule,
    AppManagerModule.forChild(MultienumRecordFieldsComponent)
]
})
export class MultienumRecordFieldsModule {}