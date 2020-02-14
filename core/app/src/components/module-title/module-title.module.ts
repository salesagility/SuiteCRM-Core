import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '../../app-manager/app-manager.module';
import {ModuletitleUiComponent} from './module-title.component';
import {AngularSvgIconModule} from 'angular-svg-icon';

@NgModule({
    declarations: [ModuletitleUiComponent],
    exports: [ModuletitleUiComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(ModuletitleUiComponent),
        AngularSvgIconModule
    ]
})
export class ModuletitleUiModule {
}