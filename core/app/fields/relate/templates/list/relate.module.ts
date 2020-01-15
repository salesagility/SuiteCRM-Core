import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppManagerModule } from '../../../../src/app-manager/app-manager.module';
import { RelateListFieldsComponent } from './relate.component';

@NgModule({
declarations: [RelateListFieldsComponent],
exports: [RelateListFieldsComponent],
imports: [
    CommonModule,
    AppManagerModule.forChild(RelateListFieldsComponent)
]
})
export class RelateListFieldsModule {}