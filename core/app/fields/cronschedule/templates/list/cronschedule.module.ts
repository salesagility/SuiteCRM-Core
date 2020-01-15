import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppManagerModule } from '../../../../src/app-manager/app-manager.module';
import { CronscheduleListFieldsComponent } from './cronschedule.component';

@NgModule({
declarations: [CronscheduleListFieldsComponent],
exports: [CronscheduleListFieldsComponent],
imports: [
    CommonModule,
    AppManagerModule.forChild(CronscheduleListFieldsComponent)
]
})
export class CronscheduleListFieldsModule {}