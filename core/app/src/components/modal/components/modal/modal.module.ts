import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {ModalUiComponent} from './modal.component';

import {ButtonModule} from '@components/button/button.module';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {ImageModule} from '@components/image/image.module';

@NgModule({
    declarations: [ModalUiComponent],
    exports: [ModalUiComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(ModalUiComponent),
        ButtonModule,
        AngularSvgIconModule,
        ImageModule
    ]
})
export class ModalUiModule {
}
