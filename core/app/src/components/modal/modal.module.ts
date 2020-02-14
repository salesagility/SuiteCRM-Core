import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '../../app-manager/app-manager.module';
import {ModalUiComponent} from './modal.component';

import {ButtonUiModule} from '../button/button.module';
import {AngularSvgIconModule} from 'angular-svg-icon';

@NgModule({
  declarations: [ModalUiComponent],
  exports: [ModalUiComponent],
  imports: [
    CommonModule,
    AppManagerModule.forChild(ModalUiComponent),
    ButtonUiModule,
    AngularSvgIconModule
  ]
})
export class ModalUiModule {
}
