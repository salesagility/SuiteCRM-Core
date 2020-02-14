import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list.component';
import { ListheaderUiModule } from '../../src/components/list-header/list-header.module';
import { ListcontainerUiModule } from '../../src/components/list-container/list-container.module';


@NgModule({
declarations: [ListComponent],
exports: [ListComponent],
imports: [
  CommonModule,
  ListheaderUiModule,
  ListcontainerUiModule
]
})
export class ListModule {}