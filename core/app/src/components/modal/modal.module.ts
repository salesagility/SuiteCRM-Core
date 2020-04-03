import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '../../app-manager/app-manager.module';
import {ModalUiComponent} from './modal.component';

import {ButtonUiModule} from '../button/button.module';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {ImageModule} from '@components/image/image.module';

@NgModule({
    declarations: [ModalUiComponent],
    exports: [ModalUiComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(ModalUiComponent),
        ButtonUiModule,
        AngularSvgIconModule,
        ImageModule
    ]
})
export class ModalUiModule {
}
