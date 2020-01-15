import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppManagerModule } from '../../../../src/app-manager/app-manager.module';
import { VarcharListFieldsComponent } from './varchar.component';

@NgModule({
declarations: [VarcharListFieldsComponent],
exports: [VarcharListFieldsComponent],
imports: [
    CommonModule,
    AppManagerModule.forChild(VarcharListFieldsComponent)
]
})
export class VarcharListFieldsModule {}