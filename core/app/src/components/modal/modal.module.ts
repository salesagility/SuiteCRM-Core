import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '../../app-manager/app-manager.module';
import {ModalUiComponent} from './modal.component';
import {AngularSvgIconModule} from 'angular-svg-icon';

@NgModule({
  declarations: [ModalUiComponent],
  exports: [ModalUiComponent],
  imports: [
    CommonModule,
    AppManagerModule.forChild(ModalUiComponent),
    AngularSvgIconModule
  ]
})
export class ModalUiModule {
}
