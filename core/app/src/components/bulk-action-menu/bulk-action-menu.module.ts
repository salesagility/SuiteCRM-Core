import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '../../app-manager/app-manager.module';
import {BulkactionmenuUiComponent} from './bulk-action-menu.component';
import {AngularSvgIconModule} from 'angular-svg-icon';

@NgModule({
    declarations: [BulkactionmenuUiComponent],
    exports: [BulkactionmenuUiComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(BulkactionmenuUiComponent),
        AngularSvgIconModule
    ]
})
export class BulkactionmenuUiModule {
}