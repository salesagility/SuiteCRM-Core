import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppManagerModule } from '../../../../src/app-manager/app-manager.module';
import { IntListFieldsComponent } from './int.component';

@NgModule({
declarations: [IntListFieldsComponent],
exports: [IntListFieldsComponent],
imports: [
    CommonModule,
    AppManagerModule.forChild(IntListFieldsComponent)
]
})
export class IntListFieldsModule {}