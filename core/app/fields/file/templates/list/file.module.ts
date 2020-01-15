import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppManagerModule } from '../../../../src/app-manager/app-manager.module';
import { FileListFieldsComponent } from './file.component';

@NgModule({
declarations: [FileListFieldsComponent],
exports: [FileListFieldsComponent],
imports: [
    CommonModule,
    AppManagerModule.forChild(FileListFieldsComponent)
]
})
export class FileListFieldsModule {}