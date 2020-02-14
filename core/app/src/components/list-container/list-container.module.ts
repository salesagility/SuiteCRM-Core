import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '../../app-manager/app-manager.module';
import {ListcontainerUiComponent} from './list-container.component';

import {TableUiModule} from '../table/table.module';
import {WidgetUiModule} from '../widget/widget.module';
import {AngularSvgIconModule} from 'angular-svg-icon';

@NgModule({
  declarations: [ListcontainerUiComponent],
  exports: [ListcontainerUiComponent],
  imports: [
    CommonModule,
    AppManagerModule.forChild(ListcontainerUiComponent),
    TableUiModule,
    WidgetUiModule,
    AngularSvgIconModule
  ]
})
export class ListcontainerUiModule {
}