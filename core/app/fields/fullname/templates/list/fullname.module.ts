import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppManagerModule } from '../../../../src/app-manager/app-manager.module';
import { FullnameListFieldsComponent } from './fullname.component';

@NgModule({
declarations: [FullnameListFieldsComponent],
exports: [FullnameListFieldsComponent],
imports: [
    CommonModule,
    AppManagerModule.forChild(FullnameListFieldsComponent)
]
})
export class FullnameListFieldsModule {}