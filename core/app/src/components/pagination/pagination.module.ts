import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '../../app-manager/app-manager.module';
import {PaginationUiComponent} from './pagination.component';
import {AngularSvgIconModule} from 'angular-svg-icon';

@NgModule({
    declarations: [PaginationUiComponent],
    exports: [PaginationUiComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(PaginationUiComponent),
        AngularSvgIconModule
    ]
})
export class PaginationUiModule {
}