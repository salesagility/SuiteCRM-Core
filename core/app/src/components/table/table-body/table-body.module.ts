import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '../../../app-manager/app-manager.module';
import {TablebodyUiComponent} from './table-body.component';
import {AngularSvgIconModule} from 'angular-svg-icon';

@NgModule({
    declarations: [TablebodyUiComponent],
    exports: [TablebodyUiComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(TablebodyUiComponent),
        AngularSvgIconModule
    ]
})
export class TablebodyUiModule {
}