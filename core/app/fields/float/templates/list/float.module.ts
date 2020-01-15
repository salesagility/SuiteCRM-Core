import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppManagerModule } from '../../../../src/app-manager/app-manager.module';
import { FloatListFieldsComponent } from './float.component';

@NgModule({
declarations: [FloatListFieldsComponent],
exports: [FloatListFieldsComponent],
imports: [
    CommonModule,
    AppManagerModule.forChild(FloatListFieldsComponent)
]
})
export class FloatListFieldsModule {}