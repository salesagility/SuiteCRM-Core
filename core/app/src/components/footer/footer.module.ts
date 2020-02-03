import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '../../app-manager/app-manager.module';
import {FooterUiComponent} from './footer.component';
import {AngularSvgIconModule} from 'angular-svg-icon';


@NgModule({
    declarations: [FooterUiComponent],
    exports: [FooterUiComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(FooterUiComponent),
        AngularSvgIconModule
    ]
})
export class FooterUiModule {
}
