import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '../../app-manager/app-manager.module';
import {WidgetUiComponent} from './widget.component';
import {AngularSvgIconModule} from 'angular-svg-icon';

@NgModule({
    declarations: [WidgetUiComponent],
    exports: [WidgetUiComponent],
    imports: [
        CommonModule,
        AngularSvgIconModule
    ]
})
export class WidgetUiModule {
}