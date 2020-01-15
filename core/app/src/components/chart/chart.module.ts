import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppManagerModule } from '../../app-manager/app-manager.module';
import { ChartUiComponent } from './chart.component';

@NgModule({
declarations: [ChartUiComponent],
exports: [ChartUiComponent],
imports: [
    CommonModule,
    AppManagerModule.forChild(ChartUiComponent)
]
})
export class ChartUiModule {}
