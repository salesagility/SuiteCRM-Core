import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '../../app-manager/app-manager.module';
import {SettingsmenuUiComponent} from './settings-menu.component';
import {AngularSvgIconModule} from 'angular-svg-icon';

@NgModule({
    declarations: [SettingsmenuUiComponent],
    exports: [SettingsmenuUiComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(SettingsmenuUiComponent),
        AngularSvgIconModule
    ]
})
export class SettingsmenuUiModule {
}