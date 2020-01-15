import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppManagerModule } from '../../../../src/app-manager/app-manager.module';
import { DynamicnumberListFieldsComponent } from './dynamicnumber.component';

@NgModule({
declarations: [DynamicnumberListFieldsComponent],
exports: [DynamicnumberListFieldsComponent],
imports: [
    CommonModule,
    AppManagerModule.forChild(DynamicnumberListFieldsComponent)
]
})
export class DynamicnumberListFieldsModule {}