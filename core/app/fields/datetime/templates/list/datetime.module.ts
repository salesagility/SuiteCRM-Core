import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppManagerModule } from '../../../../src/app-manager/app-manager.module';
import { DatetimeListFieldsComponent } from './datetime.component';

@NgModule({
declarations: [DatetimeListFieldsComponent],
exports: [DatetimeListFieldsComponent],
imports: [
    CommonModule,
    AppManagerModule.forChild(DatetimeListFieldsComponent)
]
})
export class DatetimeListFieldsModule {}