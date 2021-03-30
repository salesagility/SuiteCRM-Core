import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '../../../../app-manager/app-manager.module';
import {FooterUiComponent} from './footer.component';
import {SvgIconUiModule} from '../svg-icon/svg-icon.module';


@NgModule({
    declarations: [FooterUiComponent],
    exports: [FooterUiComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(FooterUiComponent),
        SvgIconUiModule
    ]
})
export class FooterUiModule {
}