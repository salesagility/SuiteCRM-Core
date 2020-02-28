import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';

import {WidgetUiComponent} from './widget.component';

import {ChartUiModule} from '../chart/chart.module';
import {AngularSvgIconModule} from 'angular-svg-icon';

@NgModule({
  declarations: [WidgetUiComponent],
  exports: [WidgetUiComponent],
  imports: [
    CommonModule,
    ChartUiModule,
    AngularSvgIconModule
  ]
})
export class WidgetUiModule {
}