import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '../../app-manager/app-manager.module';
import {ActionmenuUiComponent} from './action-menu.component';

import {ButtonUiModule} from '../button/button.module';
import {ModalUiModule} from '../modal/modal.module';
import {AngularSvgIconModule} from 'angular-svg-icon';

@NgModule({
  declarations: [ActionmenuUiComponent],
  exports: [ActionmenuUiComponent],
  imports: [
    CommonModule,
    AppManagerModule.forChild(ActionmenuUiComponent),
    ModalUiModule,
    ButtonUiModule,
    AngularSvgIconModule
  ]
})
export class ActionmenuUiModule {
}