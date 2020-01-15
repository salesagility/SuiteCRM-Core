import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppManagerModule } from '../../../../src/app-manager/app-manager.module';
import { BooleanListFieldsComponent } from './boolean.component';

@NgModule({
declarations: [BooleanListFieldsComponent],
exports: [BooleanListFieldsComponent],
imports: [
    CommonModule,
    AppManagerModule.forChild(BooleanListFieldsComponent)
]
})
export class BooleanListFieldsModule {}