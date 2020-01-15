import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppManagerModule } from '../../../../src/app-manager/app-manager.module';
import { DefaultListFieldsComponent } from './default.component';

@NgModule({
declarations: [DefaultListFieldsComponent],
exports: [DefaultListFieldsComponent],
imports: [
    CommonModule,
    AppManagerModule.forChild(DefaultListFieldsComponent)
]
})
export class DefaultListFieldsModule {}