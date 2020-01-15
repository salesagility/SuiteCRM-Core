import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppManagerModule } from '../../../../src/app-manager/app-manager.module';
import { ButtonRecordFieldsComponent } from './button.component';

@NgModule({
declarations: [ButtonRecordFieldsComponent],
exports: [ButtonRecordFieldsComponent],
imports: [
    CommonModule,
    AppManagerModule.forChild(ButtonRecordFieldsComponent)
]
})
export class ButtonRecordFieldsModule {}