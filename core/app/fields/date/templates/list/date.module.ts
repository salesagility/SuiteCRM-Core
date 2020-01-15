import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppManagerModule } from '../../../../src/app-manager/app-manager.module';
import { DateListFieldsComponent } from './date.component';

@NgModule({
declarations: [DateListFieldsComponent],
exports: [DateListFieldsComponent],
imports: [
    CommonModule,
    AppManagerModule.forChild(DateListFieldsComponent)
]
})
export class DateListFieldsModule {}