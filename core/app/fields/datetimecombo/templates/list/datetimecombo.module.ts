import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppManagerModule } from '../../../../src/app-manager/app-manager.module';
import { DatetimecomboListFieldsComponent } from './datetimecombo.component';

@NgModule({
declarations: [DatetimecomboListFieldsComponent],
exports: [DatetimecomboListFieldsComponent],
imports: [
    CommonModule,
    AppManagerModule.forChild(DatetimecomboListFieldsComponent)
]
})
export class DatetimecomboListFieldsModule {}