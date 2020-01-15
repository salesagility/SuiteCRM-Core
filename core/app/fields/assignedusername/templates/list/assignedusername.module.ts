import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppManagerModule } from '../../../../src/app-manager/app-manager.module';
import { AssignedusernameListFieldsComponent } from './assignedusername.component';

@NgModule({
declarations: [AssignedusernameListFieldsComponent],
exports: [AssignedusernameListFieldsComponent],
imports: [
    CommonModule,
    AppManagerModule.forChild(AssignedusernameListFieldsComponent)
]
})
export class AssignedusernameListFieldsModule {}