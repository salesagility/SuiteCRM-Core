import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppManagerModule } from '../../../../src/app-manager/app-manager.module';
import { SubmitListFieldsComponent } from './submit.component';

@NgModule({
declarations: [SubmitListFieldsComponent],
exports: [SubmitListFieldsComponent],
imports: [
    CommonModule,
    AppManagerModule.forChild(SubmitListFieldsComponent)
]
})
export class SubmitListFieldsModule {}