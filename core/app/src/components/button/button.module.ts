import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '../../app-manager/app-manager.module';
import {ButtonUiComponent} from './button.component';
import {AngularSvgIconModule} from 'angular-svg-icon';

@NgModule({
    declarations: [ButtonUiComponent],
    exports: [ButtonUiComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(ButtonUiComponent),
        AngularSvgIconModule
    ]
})
export class ButtonUiModule {
}