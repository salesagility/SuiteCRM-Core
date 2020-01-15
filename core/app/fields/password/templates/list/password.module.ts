import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppManagerModule } from '../../../../src/app-manager/app-manager.module';
import { PasswordListFieldsComponent } from './password.component';

@NgModule({
declarations: [PasswordListFieldsComponent],
exports: [PasswordListFieldsComponent],
imports: [
    CommonModule,
    AppManagerModule.forChild(PasswordListFieldsComponent)
]
})
export class PasswordListFieldsModule {}