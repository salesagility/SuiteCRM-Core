import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AngularSvgIconModule} from 'angular-svg-icon';

import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {ActionMenuComponent} from './action-menu.component';

import {ButtonModule} from '@components/button/button.module';
import {ModalUiModule} from '@components/modal/modal.module';
import {ButtonGroupModule} from '@components/button-group/button-group.module';


@NgModule({
    declarations: [ActionMenuComponent],
    exports: [ActionMenuComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(ActionMenuComponent),
        ModalUiModule,
        ButtonModule,
        AngularSvgIconModule,
        ButtonGroupModule
    ]
})
export class ActionMenuModule {
}
