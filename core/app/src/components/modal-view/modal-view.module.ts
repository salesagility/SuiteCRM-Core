import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '../../app-manager/app-manager.module';
import {ModalViewUiComponent} from './modal-view.component';
import {AngularSvgIconModule} from 'angular-svg-icon';

@NgModule({
  declarations: [ModalViewUiComponent],
  exports: [ModalViewUiComponent],
  imports: [
    CommonModule,
    AppManagerModule.forChild(ModalViewUiComponent),
    AngularSvgIconModule
  ]
})
export class ModalViewUiModule {
}
