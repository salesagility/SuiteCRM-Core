import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '../../app-manager/app-manager.module';
import {TableUiComponent} from './table.component';
import {AngularSvgIconModule} from 'angular-svg-icon';

@NgModule({
    declarations: [TableUiComponent],
    exports: [TableUiComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(TableUiComponent),
        AngularSvgIconModule
    ]
})
export class TableUiModule {
}