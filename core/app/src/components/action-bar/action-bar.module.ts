import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '../../app-manager/app-manager.module';
import {ActionBarUiComponent} from './action-bar.component';
import {AngularSvgIconModule} from 'angular-svg-icon';

@NgModule({
  declarations: [ActionBarUiComponent],
  exports: [ActionBarUiComponent],
  imports: [
    CommonModule,
    AppManagerModule.forChild(ActionBarUiComponent),
    AngularSvgIconModule
  ]
})
export class ActionBarUiModule {
}
