import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '../../app-manager/app-manager.module';
import {ListheaderUiComponent} from './list-header.component';

import {ModuletitleUiModule} from '../module-title/module-title.module';
import {ActionmenuUiModule} from '../action-menu/action-menu.module';
import {SettingsmenuUiModule} from '../settings-menu/settings-menu.module';
import {AngularSvgIconModule} from 'angular-svg-icon';

@NgModule({
  declarations: [ListheaderUiComponent],
  exports: [ListheaderUiComponent],
  imports: [
    CommonModule,
    AppManagerModule.forChild(ListheaderUiComponent),
    ModuletitleUiModule,
    ActionmenuUiModule,
    SettingsmenuUiModule,
    AngularSvgIconModule
  ]
})
export class ListheaderUiModule {
}