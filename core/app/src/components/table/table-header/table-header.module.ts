import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {TableHeaderComponent} from './table-header.component';

import {PaginationModule} from '../../pagination/pagination.module';
import {BulkActionMenuModule} from '../../bulk-action-menu/bulk-action-menu.module';
import {AngularSvgIconModule} from 'angular-svg-icon';

@NgModule({
    declarations: [TableHeaderComponent],
    exports: [TableHeaderComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(TableHeaderComponent),
        PaginationModule,
        BulkActionMenuModule,
        AngularSvgIconModule
    ]
})
export class TableHeaderModule {
}
