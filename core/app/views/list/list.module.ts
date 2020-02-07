import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list.component';

@NgModule({
declarations: [ListComponent],
exports: [ListComponent],
imports: [
  CommonModule,
]
})
export class ListModule {}