import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppManagerModule } from '../../../../src/app-manager/app-manager.module';
import { DownloadListFieldsComponent } from './download.component';

@NgModule({
declarations: [DownloadListFieldsComponent],
exports: [DownloadListFieldsComponent],
imports: [
    CommonModule,
    AppManagerModule.forChild(DownloadListFieldsComponent)
]
})
export class DownloadListFieldsModule {}