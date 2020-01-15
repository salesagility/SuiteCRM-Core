import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppManagerModule } from '../../../../src/app-manager/app-manager.module';
import { MultienumListFieldsComponent } from './multienum.component';

@NgModule({
declarations: [MultienumListFieldsComponent],
exports: [MultienumListFieldsComponent],
imports: [
    CommonModule,
    AppManagerModule.forChild(MultienumListFieldsComponent)
]
})
export class MultienumListFieldsModule {}