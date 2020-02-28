import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '../../app-manager/app-manager.module';
import {ChartUiComponent} from './chart.component';

import {AngularSvgIconModule} from 'angular-svg-icon';

@NgModule({
  declarations: [ChartUiComponent],
  exports: [ChartUiComponent],
  imports: [
    CommonModule,
    AppManagerModule.forChild(ChartUiComponent),
    AngularSvgIconModule
  ]
})
export class ChartUiModule {
}
