import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppManagerModule } from '../../../../src/app-manager/app-manager.module';
import { ButtonListFieldsComponent } from './button.component';

@NgModule({
declarations: [ButtonListFieldsComponent],
exports: [ButtonListFieldsComponent],
imports: [
    CommonModule,
    AppManagerModule.forChild(ButtonListFieldsComponent)
]
})
export class ButtonListFieldsModule {}