import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppManagerModule } from '../../../../src/app-manager/app-manager.module';
import { EnumListFieldsComponent } from './enum.component';

@NgModule({
declarations: [EnumListFieldsComponent],
exports: [EnumListFieldsComponent],
imports: [
    CommonModule,
    AppManagerModule.forChild(EnumListFieldsComponent)
]
})
export class EnumListFieldsModule {}