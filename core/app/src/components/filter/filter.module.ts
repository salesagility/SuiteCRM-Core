import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '../../app-manager/app-manager.module';
import {FilterUiComponent} from './filter.component';
import {AngularSvgIconModule} from 'angular-svg-icon';

@NgModule({
    declarations: [FilterUiComponent],
    exports: [FilterUiComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(FilterUiComponent),
        AngularSvgIconModule
    ]
})
export class FilterUiModule {
}