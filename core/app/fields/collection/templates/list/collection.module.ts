import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppManagerModule } from '../../../../src/app-manager/app-manager.module';
import { CollectionListFieldsComponent } from './collection.component';

@NgModule({
declarations: [CollectionListFieldsComponent],
exports: [CollectionListFieldsComponent],
imports: [
    CommonModule,
    AppManagerModule.forChild(CollectionListFieldsComponent)
]
})
export class CollectionListFieldsModule {}
