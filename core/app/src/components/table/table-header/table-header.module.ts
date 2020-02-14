import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '../../../app-manager/app-manager.module';
import {TableheaderUiComponent} from './table-header.component';

import {PaginationUiModule} from '../../pagination/pagination.module';
import {BulkactionmenuUiModule} from '../../bulk-action-menu/bulk-action-menu.module';
import {AngularSvgIconModule} from 'angular-svg-icon';

@NgModule({
  declarations: [TableheaderUiComponent],
  exports: [TableheaderUiComponent],
  imports: [
    CommonModule,
    AppManagerModule.forChild(TableheaderUiComponent),
    PaginationUiModule,
    BulkactionmenuUiModule,
    AngularSvgIconModule
  ]
})
export class TableheaderUiModule {
}