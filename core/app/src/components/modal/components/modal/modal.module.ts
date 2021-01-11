import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {ModalComponent} from './modal.component';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {CloseButtonModule} from '@components/close-button/close-button.module';
import {LabelModule} from '@components/label/label.module';

@NgModule({
    declarations: [ModalComponent],
    exports: [ModalComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(ModalComponent),
        AngularSvgIconModule,
        CloseButtonModule,
        LabelModule
    ]
})
export class ModalModule {
}
