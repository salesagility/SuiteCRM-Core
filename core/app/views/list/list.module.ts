import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list.component';
import { TableUiModule } from '../../src/components/table/table.module';
import { WidgetUiModule } from '../../src/components/widget/widget.module';
import { ColumnchooserUiModule } from '../../src/components/columnchooser/columnchooser.module';

@NgModule({
declarations: [ListComponent],
exports: [ListComponent],
imports: [
  CommonModule,
  WidgetUiModule,
  TableUiModule,
  ColumnchooserUiModule
]
})
export class ListModule {}