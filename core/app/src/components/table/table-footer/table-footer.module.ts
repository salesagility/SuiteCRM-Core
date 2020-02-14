import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '../../../app-manager/app-manager.module';
import {TablefooterUiComponent} from './table-footer.component';

import {PaginationUiModule} from '../../pagination/pagination.module';
import {BulkactionmenuUiModule} from '../../bulk-action-menu/bulk-action-menu.module';
import {AngularSvgIconModule} from 'angular-svg-icon';

@NgModule({
  declarations: [TablefooterUiComponent],
  exports: [TablefooterUiComponent],
  imports: [
    CommonModule,
    AppManagerModule.forChild(TablefooterUiComponent),
    PaginationUiModule,
    BulkactionmenuUiModule,
    AngularSvgIconModule
  ]
})
export class TablefooterUiModule {
}